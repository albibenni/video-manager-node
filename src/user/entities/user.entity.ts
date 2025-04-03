//import { hash } from "bcrypt";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @BeforeInsert()
  // async hashPassword() {
  //   if (this.password) {
  //     //const hashed = await scrypt(this.password, salt, 32);
  //     // const genHashed = pbkdf2Sync(
  //     //   this.password,
  //     //   salt,
  //     //   10000,
  //     //   64,
  //     //   "sha512",
  //     // ).toString("hex");

  //     //this.password = await hash(this.password, 10);
  //   }
  // }
}
