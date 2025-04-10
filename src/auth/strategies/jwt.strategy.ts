import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET") ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): { id: string } {
    return {
      id: payload.sub,
    };
  }
}
