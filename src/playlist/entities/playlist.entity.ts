import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { Video } from "../../video/entities/video.entity";

@Entity()
@Unique(["title"])
export class Playlist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Video, (video) => video.playlists, {
    cascade: true,
  })
  @JoinTable({
    name: "playlist_videos",
  })
  videos: Video[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
