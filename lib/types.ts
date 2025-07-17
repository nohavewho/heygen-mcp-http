// HeyGen API Types
export interface HeyGenCredits {
  remaining_credits: number;
  error?: string;
}

export interface Voice {
  voice_id: string;
  language: string;
  gender: string;
  name: string;
  preview_audio: string;
  support_pause: boolean;
  emotion_support: boolean;
}

export interface VoicesResponse {
  voices: Voice[];
  error?: string;
}

export interface AvatarGroup {
  avatar_group_id: string;
  avatar_group_name: string;
}

export interface AvatarGroupsResponse {
  avatar_groups: AvatarGroup[];
  error?: string;
}

export interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
}

export interface AvatarsInGroupResponse {
  avatars: Avatar[];
  error?: string;
}

export interface VideoGenerateRequest {
  video_inputs: VideoInput[];
  dimension?: {
    width: number;
    height: number;
  };
  test?: boolean;
  title?: string;
}

export interface VideoInput {
  character: {
    type: 'avatar';
    avatar_id: string;
  };
  voice: {
    type: 'text';
    input_text: string;
    voice_id: string;
  };
}

export interface VideoGenerateResponse {
  video_id?: string;
  error?: string;
}

export interface VideoStatusResponse {
  status?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  error?: string;
}

// MCP Types
export interface MCPRequest {
  method: string;
  params?: any;
  id?: string | number;
}

export interface MCPResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id?: string | number;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
} 