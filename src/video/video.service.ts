import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Video } from "./entities/video.entity";
import { UpdateVideoDto } from "./dto/video";

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

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
   * Creates a new video in the database
   *
   * @param createVideoDto - Data transfer object containing the video properties
   * @returns A Promise that resolves to the created video or undefined if an error occurs
   */
  async create(
    createVideoDto: Omit<Video, "id" | "createdAt" | "updatedAt">,
  ): Promise<Video | undefined> {
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
    updateVideoDto: Partial<UpdateVideoDto>,
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
