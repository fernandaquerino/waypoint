import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3333);
  const webUrl = process.env.WEB_URL ?? "http://localhost:3000";

  app.enableCors({
    origin: webUrl,
  });
  app.enableShutdownHooks();

  await app.listen(port, "0.0.0.0");
  console.log(`Waypoint API running on http://localhost:${port}`);
}

void bootstrap();
