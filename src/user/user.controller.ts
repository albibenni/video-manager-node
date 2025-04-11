import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserDto } from "./dto/create-user.dto";
import { AuthService } from "src/auth/auth.service";
import { RequestWithUser } from "src/auth/auth.controller";
import { Role } from "./enums/role.enum";
import { Roles } from "src/auth/decoretors/roles.decorator";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  signup(@Body() body: UserDto) {
    return this.authService.signup(body);
  }

  @Post("signin")
  signin(@Body() body: Pick<UserDto, "username" | "password">) {
    return this.authService.signIn(body.username, body.password);
  }

  @Post("signout")
  @UseGuards(JwtAuthGuard)
  signout(@Req() req: RequestWithUser) {
    return this.authService.signout(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  //@SetMetadata("role", [Role.ADMIN])
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
