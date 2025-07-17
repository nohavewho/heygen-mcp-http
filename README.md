# HeyGen MCP HTTP Server

An HTTP wrapper for the HeyGen MCP server, allowing you to integrate HeyGen's avatar video generation capabilities with any MCP-compatible client through HTTP/SSE transport.

## 🚀 Live Demo

Production URL: https://heygen-mcp-http.vercel.app/

## 📋 Features

- **HTTP/SSE Transport**: Access HeyGen tools via standard HTTP endpoints
- **All HeyGen Tools**: Complete implementation of 6 HeyGen API tools
- **Vercel Deployment**: Optimized for serverless deployment
- **Redis Session Management**: Stateful sessions using Upstash Redis
- **TypeScript**: Full type safety and IntelliSense support

## 🛠️ Available Tools

1. **get_remaining_credits** - Check your HeyGen account credits
2. **get_voices** - List available voices for avatar videos
3. **get_avatar_groups** - Get avatar groups (with optional public avatars)
4. **get_avatars_in_avatar_group** - List avatars in a specific group
5. **generate_avatar_video** - Generate an avatar video with text and voice
6. **get_avatar_video_status** - Check video generation status

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- HeyGen API key
- Redis instance (e.g., Upstash)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/nohavewho/heygen-mcp-http.git
cd heygen-mcp-http
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
HEYGEN_API_KEY=your_heygen_api_key
REDIS_URL=your_redis_url
```

4. Run the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

### Testing

Use the included test client:
```bash
node scripts/test-client.mjs
```

Or test the production deployment:
```bash
node scripts/test-client.mjs https://heygen-mcp-http.vercel.app
```

## 🚀 Deployment

### Deploy to Vercel

1. Fork this repository
2. Import to Vercel
3. Add environment variables:
   - `HEYGEN_API_KEY` - Your HeyGen API key
   - `KV_URL` or `REDIS_URL` - Your Redis connection string

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nohavewho/heygen-mcp-http)

## 🔧 Configuration

### Cursor MCP Configuration

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "heygen-http": {
      "url": "https://heygen-mcp-http.vercel.app/sse",
      "transport": "sse",
      "alwaysAllow": [
        "get_remaining_credits",
        "get_voices",
        "get_avatar_groups",
        "get_avatars_in_avatar_group",
        "get_avatar_video_status"
      ]
    }
  }
}
```

Note: `generate_avatar_video` is not in `alwaysAllow` to prevent accidental credit usage.

### Claude Desktop Configuration

Add to Claude's MCP settings:

```json
{
  "mcpServers": {
    "heygen": {
      "url": "https://heygen-mcp-http.vercel.app/sse",
      "transport": "sse"
    }
  }
}
```

## 📚 API Reference

### Transport Endpoints

- **SSE**: `GET /sse` - Server-Sent Events for real-time communication
- **HTTP**: `POST /sse` - Standard HTTP requests

### Example Usage

```javascript
// Initialize MCP client
const client = new Client({
  name: "my-client",
  version: "1.0.0"
});

// Connect to server
const transport = new SSEClientTransport(
  new URL("https://heygen-mcp-http.vercel.app/sse")
);
await client.connect(transport);

// List available tools
const tools = await client.listTools();

// Get remaining credits
const credits = await client.callTool("get_remaining_credits", {});

// Generate avatar video
const video = await client.callTool("generate_avatar_video", {
  avatar_id: "your_avatar_id",
  voice_id: "your_voice_id",
  input_text: "Hello from HeyGen!",
  title: "My Video"
});
```

## 🏗️ Architecture

- **Framework**: Next.js 15 with App Router
- **MCP Adapter**: @vercel/mcp-adapter for HTTP/SSE transport
- **API Client**: Custom HeyGen API client with full TypeScript support
- **Session Management**: Redis for stateful SSE connections
- **Deployment**: Vercel with automatic scaling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Credits

- Built on [HeyGen MCP Server](https://github.com/heygen-com/heygen-mcp)
- Powered by [@vercel/mcp-adapter](https://www.npmjs.com/package/@vercel/mcp-adapter)
- Deployed on [Vercel](https://vercel.com)
