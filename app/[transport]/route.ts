import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { HeyGenApiClient } from '@/lib/heygen-client';

const handler = createMcpHandler(
  async (server) => {
    const heygenClient = new HeyGenApiClient(process.env.HEYGEN_API_KEY!);
    
    // Get remaining credits
    server.tool(
      "get_remaining_credits",
      "Get the remaining credits for the account",
      {},
      async () => {
        try {
          const result = await heygenClient.getRemainingCredits();
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );

    // Get voices
    server.tool(
      "get_voices",
      "Get available voices for avatar videos",
      {},
      async () => {
        try {
          const result = await heygenClient.getVoices();
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );

    // Get avatar groups
    server.tool(
      "get_avatar_groups",
      "Get available avatar groups",
      {
        include_public: z.boolean().optional().default(false),
      },
      async ({ include_public }) => {
        try {
          const result = await heygenClient.listAvatarGroups(include_public);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );

    // Get avatars in group
    server.tool(
      "get_avatars_in_avatar_group",
      "Get avatars in a specific avatar group",
      {
        group_id: z.string(),
      },
      async ({ group_id }) => {
        try {
          const result = await heygenClient.getAvatarsInGroup(group_id);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );

    // Generate avatar video
    server.tool(
      "generate_avatar_video",
      "Generate a video with an avatar",
      {
        avatar_id: z.string(),
        input_text: z.string(),
        voice_id: z.string(),
        title: z.string().optional().default(''),
      },
      async ({ avatar_id, input_text, voice_id, title }) => {
        try {
          const result = await heygenClient.generateAvatarVideo({
            video_inputs: [
              {
                character: {
                  type: 'avatar',
                  avatar_id: avatar_id,
                },
                voice: {
                  type: 'text',
                  input_text: input_text,
                  voice_id: voice_id,
                },
              },
            ],
            dimension: {
              width: 1280,
              height: 720,
            },
            test: false,
            title: title || undefined,
          });
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );

    // Get avatar video status
    server.tool(
      "get_avatar_video_status",
      "Get the status of an avatar video generation",
      {
        video_id: z.string(),
      },
      async ({ video_id }) => {
        try {
          const result = await heygenClient.getVideoStatus(video_id);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: "text",
              text: `Error: ${error.message}`
            }],
            isError: true,
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        get_remaining_credits: {
          description: "Get the remaining credits for the account",
        },
        get_voices: {
          description: "Get available voices for avatar videos",
        },
        get_avatar_groups: {
          description: "Get available avatar groups",
        },
        get_avatars_in_avatar_group: {
          description: "Get avatars in a specific avatar group",
        },
        generate_avatar_video: {
          description: "Generate a video with an avatar",
        },
        get_avatar_video_status: {
          description: "Get the status of an avatar video generation",
        },
      },
    },
  },
  {
    verboseLogs: true,
    maxDuration: 60,
    redisUrl: process.env.REDIS_URL || process.env.KV_URL,
  }
);

export { handler as GET, handler as POST, handler as DELETE }; 