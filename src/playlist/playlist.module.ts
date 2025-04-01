import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistService } from "./playlist.service";
import { PlaylistController } from "./playlist.controller";
import { Playlist } from "./entities/playlist.entity";
import { VideoModule } from "../video/video.module";

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), VideoModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
