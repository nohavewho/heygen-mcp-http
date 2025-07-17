# HeyGen MCP HTTP Server

HTTP wrapper for HeyGen Model Context Protocol (MCP) server, enabling AI assistants to generate avatar videos through a standard HTTP interface.

## Features

- 🚀 Full HeyGen API integration via MCP
- 🔄 HTTP/SSE transport instead of stdio
- 🎭 Generate AI avatar videos programmatically
- 🎤 Access to 100+ voices
- 📊 Credit balance tracking
- 🔐 Secure API key management
- ⚡ Deployed on Vercel Edge Runtime

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/heygen-mcp-http.git
cd heygen-mcp-http
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
HEYGEN_API_KEY=your_heygen_api_key_here
```

Get your API key from [HeyGen](https://www.heygen.com/) (includes 10 free credits per month).

### 3. Run Locally

```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/heygen-mcp-http&env=HEYGEN_API_KEY&envDescription=Your%20HeyGen%20API%20key&envLink=https://www.heygen.com/)

## MCP Client Configuration

### For Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "heygen-http": {
      "url": "https://your-deployment.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}
```

### For Claude Desktop

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "heygen-http": {
      "url": "https://your-deployment.vercel.app/api/mcp",
      "transport": "sse"
    }
  }
}
```

## Available Tools

### `get_remaining_credits`
Check your HeyGen account balance.

```json
{
  "tool": "get_remaining_credits",
  "arguments": {}
}
```

### `get_voices`
List available voices (limited to first 100).

```json
{
  "tool": "get_voices",
  "arguments": {}
}
```

### `get_avatar_groups`
Browse avatar collections.

```json
{
  "tool": "get_avatar_groups",
  "arguments": {
    "include_public": false
  }
}
```

### `get_avatars_in_avatar_group`
List avatars in a specific group.

```json
{
  "tool": "get_avatars_in_avatar_group",
  "arguments": {
    "group_id": "your_group_id"
  }
}
```

### `generate_avatar_video`
Create an AI avatar video.

```json
{
  "tool": "generate_avatar_video",
  "arguments": {
    "avatar_id": "avatar_id",
    "input_text": "Hello, this is a test video!",
    "voice_id": "voice_id",
    "title": "My Test Video"
  }
}
```

### `get_avatar_video_status`
Check video generation progress.

```json
{
  "tool": "get_avatar_video_status",
  "arguments": {
    "video_id": "generated_video_id"
  }
}
```

## Architecture

```
heygen-mcp-http/
├── app/
│   ├── api/
│   │   └── mcp/
│   │       └── route.ts    # Main MCP endpoint
│   └── page.tsx           # Landing page
├── lib/
│   ├── types.ts           # TypeScript types
│   ├── heygen-client.ts   # HeyGen API client
│   └── mcp-server.ts      # MCP server implementation
└── package.json
```

## Development

### Run with hot reload:

```bash
npm run dev
```

### Build for production:

```bash
npm run build
```

### Type checking:

```bash
npm run type-check
```

## API Reference

The server exposes a single endpoint:

- `POST /api/mcp` - Handle MCP requests
- `GET /api/mcp` - SSE endpoint for server-initiated messages

Include `mcp-session-id` header for session management.

## Troubleshooting

### "HEYGEN_API_KEY environment variable not set"
Make sure you've created a `.env.local` file with your API key.

### Rate limiting
HeyGen API has rate limits. Check your remaining credits with `get_remaining_credits`.

### Video generation timeout
Video generation can take several minutes. Use `get_avatar_video_status` to check progress.

## License

MIT

## Credits

Based on the original [HeyGen MCP Server](https://github.com/heygen-com/heygen-mcp) by HeyGen team.
