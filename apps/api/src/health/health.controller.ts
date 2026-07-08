import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("health")
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHealth() {
    return {
      service: "@waypoint/api",
      status: "ok",
      uptime: process.uptime(),
      environment: this.configService.get<string>("NODE_ENV", "development"),
    };
  }
}
