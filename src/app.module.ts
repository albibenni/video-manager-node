import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  AppLoggerMiddleware,
  HTTPLoggerMiddleware,
} from "./middleware/app-logger";
import { VideoModule } from "./video/video.module";
import { Video } from "./video/entities/video.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PlaylistModule } from "./playlist/playlist.module";
import { Playlist } from "./playlist/entities/playlist.entity";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Video, Playlist],
      synchronize: true, // Set to false in production
      logging: true,
    }),
    VideoModule,
    PlaylistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("/health");
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
