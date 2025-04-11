import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Req } from "@nestjs/common";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";

export interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Req() req: RequestWithUser) {
    return this.authService.refreshToken(req.user.id);
  }
}
