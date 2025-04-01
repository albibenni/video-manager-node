import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Video } from "./entities/video.entity";
import { VideoDto, videoToVideoDto } from "./dto/video.dto";

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  /**
   * Populates the database with sample video data
   *
   * This method clears any existing videos in the database and adds
   * a set of predefined sample videos. It's useful for testing and
   * development purposes.
   *
   * @returns A Promise that resolves when the population is complete
   */
  async populate(): Promise<void> {
    // Sample video data for populating the database
    const sampleVideos: VideoDto[] = [
      {
        title: "Introduction to NestJS",
        description: "Learn the basics of NestJS framework",
        url: "https://example.com/nestjs-intro",
        playlists: [],
      },
      {
        title: "TypeORM Tutorial",
        description: "Complete guide to using TypeORM with NestJS",
        url: "https://example.com/typeorm-tutorial",
        playlists: [],
      },
      {
        title: "Building RESTful APIs",
        description: "How to build RESTful APIs with NestJS",
        url: "https://example.com/restful-apis",
        playlists: [],
      },
      {
        title: "Authentication in NestJS",
        description: "Implementing authentication in your NestJS application",
        url: "https://example.com/nestjs-auth",
        playlists: [],
      },
      {
        title: "Testing NestJS Applications",
        description: "Best practices for testing NestJS applications",
        url: "https://example.com/nestjs-testing",
        playlists: [],
      },
    ];

    // Delete existing videos (this will handle the foreign key constraints properly)
    await this.videoRepository
      .createQueryBuilder()
      .delete()
      .from(Video)
      .execute();

    // Create and save each video
    const createdVideos: Video[] = [];
    for (const videoData of sampleVideos) {
      const video = this.videoRepository.create(videoData);
      const savedVideo = await this.videoRepository.save(video);
      createdVideos.push(savedVideo);
    }

    console.log(`Database populated with ${createdVideos.length} videos`);
  }

  async dropAll(): Promise<void> {
    await this.videoRepository
      .createQueryBuilder()
      .delete()
      .from(Video)
      .execute();
  }

  /**
   * Retrieves all videos from the database
   *
   * @returns A Promise that resolves to an array of all videos
   */
  async findAll(): Promise<Video[]> {
    return this.videoRepository.find();
  }

  /**
   * Finds a video in the database by its ID
   *
   * @param id - The unique identifier of the video to find
   * @throws NotFoundException - If the video with the given ID is not found
   * @returns A Promise that resolves to the found video
   */
  async findOne(id: string): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  /**
   * Finds a video in the database by its ID
   *
   * @param title - The title, unique identifier, of the video to find
   * @throws NotFoundException - If the video with the given ID is not found
   * @returns A Promise that resolves to the found video
   */
  async findByVideoTitle(title: string): Promise<Video> {
    const videos = await this.videoRepository.find({
      where: { title: title },
      take: 1,
      cache: true,
    });
    if (!videos || videos.length === 0) {
      throw new NotFoundException(`Video with title ${title} not found`);
    }
    return videos[0];
  }
  /**
   * Creates a new video in the database
   *
   * @param createVideoDto - Data transfer object containing the video properties
   * @returns A Promise that resolves to the created video or undefined if an error occurs
   */
  async create(createVideoDto: VideoDto): Promise<Video | undefined> {
    try {
      const video = this.videoRepository.create(createVideoDto);
      return this.videoRepository.save(video);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   * Updates a video in the database with the provided data
   *
   * @param id - The unique identifier of the video to update
   * @param updateVideoDto - Partial video object containing the fields to update
   * @throws NotFoundException - If the video with the given ID is not found
   * @returns A Promise that resolves to the updated video or undefined if an error occurs
   */
  async update(
    id: string,
    updateVideoDto: Partial<VideoDto>,
  ): Promise<Video | undefined> {
    try {
      const video = await this.findOne(id);
      Object.assign(video, updateVideoDto);
      return this.videoRepository.save(video);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   * Removes a video from the database by its ID
   *
   * @param id - The unique identifier of the video to remove
   * @throws NotFoundException - If the video with the given ID is not found
   * @returns A Promise that resolves when the video is successfully removed
   */
  async remove(id: string): Promise<void> {
    try {
      const video = await this.findOne(id);
      if (video) await this.videoRepository.remove(video);
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
