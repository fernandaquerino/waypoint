import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: "Waypoint API",
      status: "ready",
    };
  }

  @Get("health")
  getHealth() {
    return {
      status: "ok",
      service: "@waypoint/api",
    };
  }
}
