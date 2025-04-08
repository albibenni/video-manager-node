import type { Video } from "../entities/video.entity";

export type VideoDto = Omit<Video, "id" | "createdAt" | "updatedAt">;

export function videoToVideoDto(video: Video): VideoDto {
  return {
    title: video.title,
    description: video.description,
    url: video.url,
    playlists: video.playlists,
  };
}
