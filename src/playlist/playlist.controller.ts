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
import { PlaylistService } from "./playlist.service";
import { PlaylistDto, playlistToPlaylistDto } from "./dto/playlist.dto";

@Controller("playlists")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post("populate")
  @HttpCode(HttpStatus.CREATED)
  async populate(): Promise<void> {
    await this.playlistService.populatePlaylist();
  }

  @Post("create")
  async create(@Body() createPlaylistDto: PlaylistDto): Promise<PlaylistDto> {
    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  async findAll(): Promise<PlaylistDto[]> {
    return this.playlistService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PlaylistDto> {
    return this.playlistService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePlaylistDto: PlaylistDto,
  ): Promise<PlaylistDto> {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.playlistService.remove(id);
  }

  @Post(":id/videos/:videoId")
  async addVideo(
    @Param("id") id: string,
    @Param("videoId") videoId: string,
  ): Promise<PlaylistDto> {
    return this.playlistService.addVideo(id, videoId);
  }

  @Delete(":id/videos/:videoId")
  async removeVideo(
    @Param("id") id: string,
    @Param("videoId") videoId: string,
  ): Promise<PlaylistDto> {
    return this.playlistService.removeVideo(id, videoId);
  }
}
