import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Req } from "@nestjs/common";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.authService.refreshToken(req.user.id as string);
  }
}
