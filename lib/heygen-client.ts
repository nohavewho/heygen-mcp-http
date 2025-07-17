import {
  HeyGenCredits,
  VoicesResponse,
  AvatarGroupsResponse,
  AvatarsInGroupResponse,
  VideoGenerateRequest,
  VideoGenerateResponse,
  VideoStatusResponse,
} from './types';

export class HeyGenApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.heygen.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`HeyGen API error: ${error}`);
      throw error;
    }
  }

  async getRemainingCredits(): Promise<HeyGenCredits> {
    try {
      const data = await this.request<any>('/v1/user/remaining_quota');
      return {
        remaining_quota: data.data?.remaining_quota || 0,
      };
    } catch (error) {
      return {
        remaining_quota: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getVoices(): Promise<VoicesResponse> {
    try {
      const data = await this.request<any>('/v2/voices');
      const voices = data.data?.voices || [];
      // Limit to first 100 voices as per original implementation
      return {
        voices: voices.slice(0, 100),
      };
    } catch (error) {
      return {
        voices: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listAvatarGroups(includePublic: boolean = false): Promise<AvatarGroupsResponse> {
    try {
      const params = new URLSearchParams({
        is_public: includePublic.toString(),
      });
      const data = await this.request<any>(`/v2/avatar_group.list?${params}`);
      return {
        avatar_groups: data.data?.avatar_groups || [],
      };
    } catch (error) {
      return {
        avatar_groups: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAvatarsInGroup(groupId: string): Promise<AvatarsInGroupResponse> {
    try {
      const params = new URLSearchParams({
        avatar_group_id: groupId,
      });
      const data = await this.request<any>(`/v2/avatars?${params}`);
      return {
        avatars: data.data?.avatars || [],
      };
    } catch (error) {
      return {
        avatars: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateAvatarVideo(request: VideoGenerateRequest): Promise<VideoGenerateResponse> {
    try {
      const data = await this.request<any>('/v2/video/generate', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return {
        video_id: data.data?.video_id,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
    try {
      const params = new URLSearchParams({
        video_id: videoId,
      });
      const data = await this.request<any>(`/v1/video_status.get?${params}`);
      return {
        status: data.data?.status,
        video_url: data.data?.video_url,
        thumbnail_url: data.data?.thumbnail_url,
        duration: data.data?.duration,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
} 