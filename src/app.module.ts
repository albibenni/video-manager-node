import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  AppLoggerMiddleware,
  HTTPLoggerMiddleware,
} from "./middleware/app-logger";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("/health");
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
