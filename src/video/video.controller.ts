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
import { CreateVideoDto, UpdateVideoDto } from "./dto/video";

@Controller("videos")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Video | undefined> {
    return this.videoService.create(createVideoDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateVideoDto: Partial<UpdateVideoDto>,
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
