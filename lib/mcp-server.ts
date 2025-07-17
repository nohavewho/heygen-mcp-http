import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { HeyGenApiClient } from './heygen-client';
import { VideoGenerateRequest } from './types';

// Tool schemas
const GetRemainingCreditsSchema = z.object({});

const GetVoicesSchema = z.object({});

const GetAvatarGroupsSchema = z.object({
  include_public: z.boolean().optional().default(false),
});

const GetAvatarsInGroupSchema = z.object({
  group_id: z.string(),
});

const GenerateAvatarVideoSchema = z.object({
  avatar_id: z.string(),
  input_text: z.string(),
  voice_id: z.string(),
  title: z.string().optional().default(''),
});

const GetVideoStatusSchema = z.object({
  video_id: z.string(),
});

export class HeyGenMCPServer {
  private server: Server;
  private heygenClient: HeyGenApiClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'heygen-mcp-http',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private getHeyGenClient(): HeyGenApiClient {
    if (!this.heygenClient) {
      const apiKey = process.env.HEYGEN_API_KEY;
      if (!apiKey) {
        throw new Error('HEYGEN_API_KEY environment variable not set');
      }
      this.heygenClient = new HeyGenApiClient(apiKey);
    }
    return this.heygenClient;
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_remaining_credits',
            description: 'Retrieves the remaining credits in your Heygen account.',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_voices',
            description:
              'Retrieves a list of available voices from the Heygen API (limited to first 100 voices).',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_avatar_groups',
            description:
              'Retrieves a list of Heygen avatar groups. By default, only private avatar groups are returned.',
            inputSchema: {
              type: 'object',
              properties: {
                include_public: {
                  type: 'boolean',
                  description: 'Include public avatar groups',
                  default: false,
                },
              },
            },
          },
          {
            name: 'get_avatars_in_avatar_group',
            description: 'Retrieves a list of avatars in a specific Heygen avatar group.',
            inputSchema: {
              type: 'object',
              properties: {
                group_id: {
                  type: 'string',
                  description: 'The avatar group ID',
                },
              },
              required: ['group_id'],
            },
          },
          {
            name: 'generate_avatar_video',
            description: 'Generates a new avatar video with the specified avatar, text, and voice.',
            inputSchema: {
              type: 'object',
              properties: {
                avatar_id: {
                  type: 'string',
                  description: 'The avatar ID to use',
                },
                input_text: {
                  type: 'string',
                  description: 'The text for the avatar to speak',
                },
                voice_id: {
                  type: 'string',
                  description: 'The voice ID to use',
                },
                title: {
                  type: 'string',
                  description: 'Optional title for the video',
                  default: '',
                },
              },
              required: ['avatar_id', 'input_text', 'voice_id'],
            },
          },
          {
            name: 'get_avatar_video_status',
            description:
              'Retrieves the status of a video generated via the Heygen API. Video status may take several minutes to hours depending on length and queue time.',
            inputSchema: {
              type: 'object',
              properties: {
                video_id: {
                  type: 'string',
                  description: 'The video ID to check status for',
                },
              },
              required: ['video_id'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const client = this.getHeyGenClient();

        switch (request.params.name) {
          case 'get_remaining_credits': {
            const result = await client.getRemainingCredits();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_voices': {
            const result = await client.getVoices();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_avatar_groups': {
            const args = GetAvatarGroupsSchema.parse(request.params.arguments || {});
            const result = await client.listAvatarGroups(args.include_public);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_avatars_in_avatar_group': {
            const args = GetAvatarsInGroupSchema.parse(request.params.arguments);
            const result = await client.getAvatarsInGroup(args.group_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'generate_avatar_video': {
            const args = GenerateAvatarVideoSchema.parse(request.params.arguments);
            const videoRequest: VideoGenerateRequest = {
              title: args.title,
              video_inputs: [
                {
                  character: {
                    avatar_id: args.avatar_id,
                  },
                  voice: {
                    input_text: args.input_text,
                    voice_id: args.voice_id,
                  },
                },
              ],
              dimension: {
                width: 1280,
                height: 720,
              },
            };
            const result = await client.generateAvatarVideo(videoRequest);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_avatar_video_status': {
            const args = GetVideoStatusSchema.parse(request.params.arguments);
            const result = await client.getVideoStatus(args.video_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${error.errors.map((e) => e.message).join(', ')}`
          );
        }
        throw error;
      }
    });
  }

  createTransport(): StreamableHTTPServerTransport {
    return new StreamableHTTPServerTransport({
      sessionIdGenerator: () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  }

  async connect(transport: StreamableHTTPServerTransport) {
    await this.server.connect(transport);
  }
} 