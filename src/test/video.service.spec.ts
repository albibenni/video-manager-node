import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Video } from "../video/entities/video.entity";
import { VideoService } from "../video/video.service";

describe("VideoService", () => {
  let service: VideoService;
  let repository: Repository<Video>;

  const mockRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(Video),
          useValue: mockRepository,
        },
      ],
    }).compile();

    //@ts-ignore
    service = module.get<VideoService>(VideoService);
    //@ts-ignore
    repository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  describe("findByVideoTitle", () => {
    const mockVideo = {
      id: "123",
      title: "Test Video",
      description: "Test Description",
      url: "https://example.com/test",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should find a video by title", async () => {
      mockRepository.find.mockResolvedValue([mockVideo]);

      const result = await service.findByVideoTitle("Test Video");

      expect(result).toEqual(mockVideo);
      expect(repository.find).toHaveBeenCalledWith({
        where: { title: "Test Video" },
        take: 1,
        cache: true,
      });
    });

    it("should throw NotFoundException when video is not found", async () => {
      mockRepository.find.mockResolvedValue([]);

      await expect(
        service.findByVideoTitle("Non-existent Video"),
      ).rejects.toThrow(NotFoundException);
      expect(repository.find).toHaveBeenCalledWith({
        where: { title: "Non-existent Video" },
        take: 1,
        cache: true,
      });
    });
  });
});
