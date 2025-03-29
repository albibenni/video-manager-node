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
import { Video } from "./entities/video.entity";
import { VideoDto } from "./dto/video.dto";

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
  async findAll(): Promise<Video[]> {
    //TODO: dto
    return this.videoService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Video> {
    const video = await this.videoService.findOne(id);
    if (!video) {
      throw new Error("Video not found");
    }
    return video;
  }

  @Get("video/:title")
  async findOneByTitle(@Param("title") title: string): Promise<Video> {
    const video = await this.videoService.findOne(title);
    if (!video) {
      throw new Error("Video not found");
    }
    return video;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() video: VideoDto): Promise<Video | undefined> {
    return this.videoService.create(video);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateVideoDto: Partial<VideoDto>,
  ): Promise<Video> {
    const video = await this.videoService.update(id, updateVideoDto);
    if (!video) {
      throw new Error("Video not found");
    }
    return video;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.videoService.remove(id);
  }
}
