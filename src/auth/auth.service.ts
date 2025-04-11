import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { CreateUser, UserDto } from "src/user/dto/create-user.dto";
import { promisify } from "util";
import { randomBytes, scrypt } from "crypto";
import { User } from "src/user/entities/user.entity";
import { handleErrorLog } from "src/utils/utils";
import refreshJwtConfig from "./config/refresh-jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtPayload } from "./guards/jwt-auth.guard";

export type Tokens = {
  access_token: string;
  refresh_token: string;
};
const scryptAsync = promisify(scrypt);
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<Tokens | undefined> {
    try {
      const user = await this.userService.findByUsername(username);
      const [salt, storedHash] = user.password.split(".");
      const inputPasswordHash = (await scryptAsync(
        password,
        salt,
        64,
      )) as Buffer;
      if (storedHash !== inputPasswordHash.toString("hex")) {
        throw new BadRequestException("Wrong Credentials");
      }
      const { access_token, refresh_token } = await this.generateTokens(
        user.id,
      );
      const refresh_salt = randomBytes(9).toString("hex");
      const refreshTokenHash = (
        (await scryptAsync(refresh_token, refresh_salt, 64)) as Buffer
      ).toString("hex");
      await this.userService.updateRefreshToken(
        `${refresh_salt}.${refreshTokenHash}`,
        user.id,
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      handleErrorLog(e);
    }
  }

  private async generateTokens(userId: string): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async signup(user: UserDto): Promise<User | undefined> {
    try {
      const salt = randomBytes(9).toString("hex");
      const buffHash = (await scryptAsync(user.password, salt, 64)) as Buffer;
      const newUser: CreateUser = {
        ...user,
        password: `${salt}.${buffHash.toString("hex")}`,
        hashedRefreshToken: "",
      };
      return await this.userService.create(newUser);
    } catch (e) {
      handleErrorLog(e);
    }
  }

  async refreshToken(userId: string): Promise<Tokens> {
    const { access_token, refresh_token } = await this.generateTokens(userId);
    const refresh_salt = randomBytes(9).toString("hex");
    const refreshTokenHash = (
      (await scryptAsync(refresh_token, refresh_salt, 64)) as Buffer
    ).toString("hex");
    await this.userService.updateRefreshToken(
      `${refresh_salt}.${refreshTokenHash}`,
      userId,
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      handleErrorLog(e);
      throw new UnauthorizedException("Invalid token");
    }
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const [salt, storedHash] = user.hashedRefreshToken.split(".");
    const inputRefreshToken = (
      (await scryptAsync(refreshToken, salt, 64)) as Buffer
    ).toString("hex");

    console.log("128 aaaaaaaaa", storedHash === inputRefreshToken);

    if (storedHash !== inputRefreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    return { id: userId };
  }

  async signout(userId: string) {
    await this.userService.updateRefreshToken(userId, "");
  }
}
