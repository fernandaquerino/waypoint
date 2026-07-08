import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DATABASE_CONNECTION } from "./database.constants";

@Global()
@Module({
  exports: [DATABASE_CONNECTION],
  providers: [
    {
      inject: [ConfigService],
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>("database.url");
        const { createDatabaseClient } = await import("@waypoint/db");
        return createDatabaseClient(databaseUrl);
      },
    },
  ],
})
export class DatabaseModule {}
