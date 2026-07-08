import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "../../database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
