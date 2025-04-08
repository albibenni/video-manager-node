import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Bootstraps the NestJS application
 * @returns Promise<void>
 */
async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api");
    await app.listen(
      process.env.SERVER_PORT ?? 8000,
      process.env.SERVER_HOST ?? "0.0.0.0",
    );
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error("Error during application bootstrap:", error);
    process.exit(1);
  }
}

void bootstrap();
