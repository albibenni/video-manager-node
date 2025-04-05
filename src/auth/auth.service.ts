import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserDto } from "src/user/dto/create-user.dto";
import { promisify } from "util";
import { randomBytes, scrypt } from "crypto";
import { User } from "src/user/entities/user.entity";

const scryptAsync = promisify(scrypt);
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // This is a simple example. In a real application, you would:
    // 1. Hash the password
    // 2. Check against a database
    // 3. Implement proper user management
    if (username === "admin" && password === "admin") {
      return { id: 1, username: "admin" };
    }
    return null;
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(username);
    //if (!user || !(await compare(password, user.password))) {
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const [salt, storedHash] = user.password.split(".");
    const inputPasswordHash = (await scryptAsync(password, salt, 64)) as Buffer;
    if (storedHash !== inputPasswordHash.toString("hex")) {
      throw new BadRequestException("Wrong Credentials");
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      //expires_in: "1d",
    };
  }

  async signup(user: UserDto): Promise<User | undefined> {
    try {
      const salt = randomBytes(9).toString("hex");
      const buffHash = (await scryptAsync(user.password, salt, 64)) as Buffer;
      const newUser = {
        ...user,
        password: `${salt}.${buffHash.toString("hex")}`,
      };
      console.log(newUser);
      return await this.userService.create(newUser);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
