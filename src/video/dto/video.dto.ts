import { Video } from "../entities/video.entity";

export type VideoDto = Omit<Video, "id" | "createdAt" | "updatedAt">;
