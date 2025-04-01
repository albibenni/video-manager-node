import { Playlist } from "src/playlist/entities/playlist.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
} from "typeorm";

@Entity("videos")
@Unique(["title"])
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  url: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.videos)
  playlists: Playlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
