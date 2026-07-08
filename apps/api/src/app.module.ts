import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { appConfig } from "./config/app.config";
import { envFilePaths } from "./config/env-file-paths";
import { validateEnvironment } from "./config/env.validation";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: envFilePaths,
      expandVariables: true,
      isGlobal: true,
      load: [appConfig],
      validate: validateEnvironment,
    }),
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
