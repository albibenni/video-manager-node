import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";
import jwtConfig from "../config/jwt.config";
import { UserIdAndRole } from "../auth.controller";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtTokenConfig: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtTokenConfig.secret ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): Promise<UserIdAndRole> {
    const userId = payload.sub;
    return this.authService.validateJwtUser(userId);
  }
}
