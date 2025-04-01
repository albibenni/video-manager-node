import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Playlist } from "../playlist/entities/playlist.entity";
import { VideoService } from "../video/video.service";
import { PlaylistDto } from "../playlist/dto/playlist.dto";
import { sleep } from "src/utils/utils";

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private videoService: VideoService,
  ) {}

  async populatePlaylist(): Promise<void> {
    // Delete existing playlists (this will handle the foreign key constraints properly)
    await this.playlistRepository
      .createQueryBuilder()
      .delete()
      .from(Playlist)
      .execute();
    await sleep(10);

    // Sample playlist data
    const samplePlaylists: PlaylistDto[] = [
      {
        name: "NestJS Tutorials",
        description: "A collection of NestJS tutorials and guides",
        videos: [], // Will be populated with actual videos
      },
      {
        name: "TypeORM Deep Dive",
        description: "In-depth tutorials about TypeORM and database management",
        videos: [], // Will be populated with actual videos
      },
      {
        name: "Testing Best Practices",
        description: "Learn about testing in NestJS applications",
        videos: [], // Will be populated with actual videos
      },
      {
        name: "API Development",
        description: "RESTful API development with NestJS",
        videos: [], // Will be populated with actual videos
      },
      {
        name: "Authentication & Security",
        description: "Security best practices and authentication in NestJS",
        videos: [], // Will be populated with actual videos
      },
    ];

    // Create and save each playlist
    for (const playlistData of samplePlaylists) {
      const playlist = await this.create(playlistData);
      if (!playlist)
        throw new Error(`Error creating playlist: ${playlistData.name}`);
      console.log(`Created playlist: ${playlist.name}`);
    }

    console.log("Database populated with sample playlists");
  }

  async create(createPlaylistDto: PlaylistDto): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      name: createPlaylistDto.name,
      description: createPlaylistDto.description,
    });

    if (createPlaylistDto.videos.length) {
      const videos = await Promise.all(
        createPlaylistDto.videos.map((video) =>
          this.videoService.findOne(video.id),
        ),
      );
      playlist.videos = videos;
    }

    return this.playlistRepository.save(playlist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find({
      relations: ["videos"],
    });
  }

  async findOne(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ["videos"],
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    return playlist;
  }

  async update(
    id: string,
    updatePlaylistDto: Partial<PlaylistDto>,
  ): Promise<Playlist> {
    const playlist = await this.findOne(id);

    if (updatePlaylistDto.name) {
      playlist.name = updatePlaylistDto.name;
    }

    if (updatePlaylistDto.description !== undefined) {
      playlist.description = updatePlaylistDto.description;
    }

    if (updatePlaylistDto.videos) {
      const videos = await Promise.all(
        updatePlaylistDto.videos.map((video) =>
          this.videoService.findOne(video.id),
        ),
      );
      playlist.videos = videos;
    }

    return this.playlistRepository.save(playlist);
  }

  async remove(id: string): Promise<void> {
    const playlist = await this.findOne(id);
    await this.playlistRepository.remove(playlist);
  }

  async addVideo(id: string, videoId: string): Promise<Playlist> {
    const playlist = await this.findOne(id);
    const video = await this.videoService.findOne(videoId);

    if (!playlist.videos) {
      playlist.videos = [];
    }

    playlist.videos.push(video);
    return this.playlistRepository.save(playlist);
  }

  async removeVideo(id: string, videoId: string): Promise<Playlist> {
    const playlist = await this.findOne(id);
    playlist.videos = playlist.videos.filter((video) => video.id !== videoId);
    return this.playlistRepository.save(playlist);
  }
}
