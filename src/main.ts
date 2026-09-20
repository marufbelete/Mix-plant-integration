import "./env";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { initMixPlantSync } from "./mix_plant/sync";

async function bootstrap() {
  await initMixPlantSync();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("API DOCUMENTATION")
    .setDescription("API")
    .setVersion("1.0")
    .addTag("APIs")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api_doc", app, document);

  app.use(helmet());
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim())
    : ["http://localhost:3000"];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  const port = process.env.PORT || 7000;
  await app.listen(port);
}
bootstrap();
