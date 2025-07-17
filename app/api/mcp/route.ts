import { NextRequest, NextResponse } from 'next/server';
import { HeyGenMCPServer } from '@/lib/mcp-server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'crypto';

// Type definitions for Express-like request/response
interface MockRequest {
  headers: Record<string, string>;
  body?: any;
}

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  setHeader(name: string, value: string): void;
  writeHead(status: number): MockResponse;
  end(data?: string): any;
  write?(data: string): void;
  on?(event: string, handler: () => void): void;
}

// Store transports by session ID for stateful connections
const transports = new Map<string, StreamableHTTPServerTransport>();
const servers = new Map<string, HeyGenMCPServer>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('mcp-session-id');
    
    let transport = sessionId ? transports.get(sessionId) : undefined;
    let server = sessionId ? servers.get(sessionId) : undefined;

    if (!transport || !server) {
      if (!isInitializeRequest(body)) {
        return NextResponse.json(
          {
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: No valid session ID provided',
            },
            id: null,
          },
          { status: 400 }
        );
      }

      // Create new session
      server = new HeyGenMCPServer();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          if (transport && server) {
            transports.set(newSessionId, transport);
            servers.set(newSessionId, server);
          }
        },
      });

      // Clean up on close
      const currentTransport = transport;
      currentTransport.onclose = () => {
        if (currentTransport.sessionId) {
          transports.delete(currentTransport.sessionId);
          servers.delete(currentTransport.sessionId);
        }
      };

      await server.connect(transport);
    }

    // Create a mock Express-like request/response
    const mockReq = {
      headers: Object.fromEntries(request.headers.entries()),
      body,
    };

    const mockRes = {
      statusCode: 200,
      headers: {} as Record<string, string>,
      setHeader(name: string, value: string) {
        this.headers[name] = value;
      },
      writeHead(status: number) {
        this.statusCode = status;
        return this;
      },
      end(data: string) {
        return NextResponse.json(JSON.parse(data), {
          status: this.statusCode,
          headers: {
            ...this.headers,
            'mcp-session-id': transport.sessionId || '',
          },
        });
      },
    };

    // Handle the request
    await transport.handleRequest(mockReq as any, mockRes as any, body);
    
    // If response wasn't sent synchronously, send it now
    if (!mockRes.headers['Content-Type']) {
      return NextResponse.json(
        { jsonrpc: '2.0', result: null, id: body.id },
        {
          headers: {
            'mcp-session-id': transport.sessionId || '',
          },
        }
      );
    }

    // Return the response that was set by handleRequest
    return mockRes.end('{}');
  } catch (error) {
    console.error('MCP request error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

// SSE endpoint for server-initiated messages
export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('mcp-session-id');
  
  if (!sessionId || !transports.has(sessionId)) {
    return new NextResponse('Invalid or missing session ID', { status: 400 });
  }

  const transport = transports.get(sessionId)!;

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Mock Express-like request/response for SSE
      const mockReq = {
        headers: Object.fromEntries(request.headers.entries()),
      };

      const mockRes = {
        setHeader() {},
        write(data: string) {
          controller.enqueue(encoder.encode(data));
        },
        on(event: string, handler: () => void) {
          if (event === 'close') {
            // Handle cleanup when client disconnects
            request.signal.addEventListener('abort', handler);
          }
        },
      };

      try {
        await transport.handleRequest(mockReq as any, mockRes as any);
      } catch (error) {
        console.error('SSE error:', error);
        controller.close();
      }
    },
    cancel() {
      // Cleanup when stream is cancelled
      if (sessionId) {
        transports.delete(sessionId);
        servers.delete(sessionId);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Handle DELETE for session termination
export async function DELETE(request: NextRequest) {
  const sessionId = request.headers.get('mcp-session-id');
  
  if (!sessionId || !transports.has(sessionId)) {
    return new NextResponse('Invalid or missing session ID', { status: 400 });
  }

  const transport = transports.get(sessionId)!;
  
  // Mock Express-like request/response
  const mockReq = {
    headers: Object.fromEntries(request.headers.entries()),
  };

  const mockRes = {
    statusCode: 200,
    setHeader() {},
    writeHead(status: number) {
      this.statusCode = status;
      return this;
    },
    end() {
      // Clean up
      transports.delete(sessionId);
      servers.delete(sessionId);
    },
  };

  await transport.handleRequest(mockReq as any, mockRes as any);
  
  return new NextResponse(null, { status: mockRes.statusCode });
}

// Clean up old sessions periodically
if (typeof globalThis !== 'undefined') {
  const cleanupKey = Symbol.for('mcp.cleanup.interval');
  if (!(cleanupKey in globalThis)) {
    (globalThis as any)[cleanupKey] = setInterval(() => {
      const now = Date.now();
      const maxAge = 30 * 60 * 1000; // 30 minutes

      for (const [sessionId, transport] of transports) {
        // Extract timestamp from session ID (UUID v4 doesn't have timestamp, so we'll track separately)
        // For now, we'll skip automatic cleanup since we can't determine age from UUID
        // In production, you'd want to track creation time separately
      }
    }, 5 * 60 * 1000); // Run every 5 minutes
  }
} 