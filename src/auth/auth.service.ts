import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserDto } from "src/user/dto/create-user.dto";
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
      // could be just the sub user.id
      const payload: JwtPayload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, this.refreshTokenConfig),
      };
    } catch (e) {
      handleErrorLog(e);
    }
  }

  async signup(user: UserDto): Promise<User | undefined> {
    try {
      const salt = randomBytes(9).toString("hex");
      const buffHash = (await scryptAsync(user.password, salt, 64)) as Buffer;
      const newUser = {
        ...user,
        password: `${salt}.${buffHash.toString("hex")}`,
      };
      return await this.userService.create(newUser);
    } catch (e) {
      handleErrorLog(e);
    }
  }

  refreshToken(userId: string) {
    const payload: JwtPayload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
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
}
