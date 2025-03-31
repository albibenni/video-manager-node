import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
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

  // @ManyToMany(() => Playlist, (playlist) => playlist.videos, {
  //   cascade: true,
  // })
  // playlists: Playlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
