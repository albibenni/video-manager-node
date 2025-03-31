import { Playlist } from "../entities/playlist.entity";

export type PlaylistDto = Omit<Playlist, "id" | "createdAt" | "updatedAt">;

export function playlistToPlaylistDto(playlist: Playlist): PlaylistDto {
  return {
    name: playlist.name,
    description: playlist.description,
    videos: playlist.videos,
  };
}
