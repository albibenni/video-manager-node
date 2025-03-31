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

@Entity("playlists")
@Unique(["name"])
export class Playlist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Video, {
    //cascade: true,
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
