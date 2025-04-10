import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtTokenConfig: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtTokenConfig.secret ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): { id: string } {
    return {
      id: payload.sub,
    };
  }
}
