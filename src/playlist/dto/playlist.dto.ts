import { Playlist } from "../entities/playlist.entity";

// export type PlaylistDto = {
//   title: string;
//   description: string;
//   videoIds: string[];
// };

export type PlaylistDto = Omit<Playlist, "id" | "createdAt" | "updatedAt">;

export function playlistToPlaylistDto(playlist: Playlist): PlaylistDto {
  return {
    title: playlist.title,
    description: playlist.description,
    videos: playlist.videos,
  };
}
