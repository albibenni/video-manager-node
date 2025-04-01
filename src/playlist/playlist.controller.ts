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
  Put,
} from "@nestjs/common";
import { PlaylistService } from "./playlist.service";
import { PlaylistDto, AddAndRemovePlaylistDto } from "./dto/playlist.dto";

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

  @Put("/videos/add-to-playlist")
  async addVideoToPlaylist(
    @Body() addVideoToPlaylistDto: AddAndRemovePlaylistDto,
  ): Promise<PlaylistDto> {
    return this.playlistService.addVideoToPlaylist(
      addVideoToPlaylistDto.playlistName,
      addVideoToPlaylistDto.videoTitle,
    );
  }

  @Delete("/videos/remove-from-playlist")
  async removeVideoFromPlaylist(
    @Body() removeVideoFromPlaylistDto: AddAndRemovePlaylistDto,
  ): Promise<PlaylistDto> {
    return this.playlistService.removeVideoFromPlaylist(
      removeVideoFromPlaylistDto.playlistName,
      removeVideoFromPlaylistDto.videoTitle,
    );
  }
}
