import { Video } from "../entities/video.entity";

export type CreateVideoDto = Omit<Video, "id" | "createdAt" | "updatedAt">;
export type UpdateVideoDto = Omit<Video, "id" | "createdAt" | "updatedAt">;
