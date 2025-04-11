import type { User } from "../entities/user.entity";

export type UserDto = Pick<User, "username" | "password" | "email">;

export type CreateUser = Omit<
  User,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;
