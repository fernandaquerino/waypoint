import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { AuthenticatedUser } from "./types/authenticated-user";
import type { JwtPayload } from "./types/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>("auth.secret");

    if (!secret) {
      throw new Error("AUTH_SECRET must be defined to validate JWTs");
    }

    super({
      algorithms: ["HS256"],
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      throw new UnauthorizedException("Token sem identificador de usuário.");
    }

    return {
      email: typeof payload.email === "string" ? payload.email : undefined,
      id: payload.sub,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
  }
}
