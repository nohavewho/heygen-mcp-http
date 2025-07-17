export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            HeyGen MCP HTTP Server
          </h1>
          
          <p className="text-xl mb-8 text-gray-300">
            HTTP wrapper for HeyGen Model Context Protocol (MCP) server, enabling AI assistants to generate avatar videos.
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🚀 Quick Start</h2>
            <p className="mb-4">Connect your MCP client to this server using:</p>
            <code className="block bg-gray-900 p-4 rounded text-green-400">
              {typeof window !== 'undefined' && `${window.location.origin}/api/mcp`}
            </code>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🛠️ Available Tools</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>get_remaining_credits</strong> - Check your HeyGen account balance
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>get_voices</strong> - List available voices (first 100)
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>get_avatar_groups</strong> - Browse avatar collections
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>get_avatars_in_avatar_group</strong> - List avatars in a group
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>generate_avatar_video</strong> - Create AI avatar videos
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <div>
                  <strong>get_avatar_video_status</strong> - Check video generation progress
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🔧 Configuration</h2>
            <p className="mb-2">Set your HeyGen API key as an environment variable:</p>
            <code className="block bg-gray-900 p-4 rounded text-green-400">
              HEYGEN_API_KEY=your_api_key_here
            </code>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">📚 Resources</h2>
            <div className="space-y-2">
              <a 
                href="https://docs.heygen.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 block"
              >
                HeyGen API Documentation →
              </a>
              <a 
                href="https://modelcontextprotocol.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 block"
              >
                Model Context Protocol →
              </a>
              <a 
                href="https://github.com/heygen-com/heygen-mcp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 block"
              >
                Original HeyGen MCP Server →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
