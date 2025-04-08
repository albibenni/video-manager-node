import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoDto, videoToVideoDto } from "./dto/video.dto";

@Controller("videos")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post("populate")
  async populate(): Promise<void> {
    return this.videoService.populate();
  }

  @Delete("drop")
  async drop(): Promise<void> {
    return this.videoService.dropAll();
  }

  @Get("all")
  async findAll(): Promise<VideoDto[]> {
    const videos = await this.videoService.findAll();
    return videos.map((video) => videoToVideoDto(video));
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<VideoDto> {
    const video = await this.videoService.findOne(id);
    return videoToVideoDto(video);
  }

  @Get("video/:title")
  async findOneByTitle(@Param("title") title: string): Promise<VideoDto> {
    const video = await this.videoService.findByVideoTitle(title);
    return videoToVideoDto(video);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() video: VideoDto): Promise<VideoDto | undefined> {
    const createdVideo = await this.videoService.create(video);
    return createdVideo ? videoToVideoDto(createdVideo) : undefined;
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateVideoDto: Partial<VideoDto>,
  ): Promise<VideoDto> {
    const video = await this.videoService.update(id, updateVideoDto);
    if (!video) {
      throw new Error("Video not found");
    }
    return videoToVideoDto(video);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.videoService.remove(id);
  }
}
