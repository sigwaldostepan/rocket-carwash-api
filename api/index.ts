import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import express from 'express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { ExpressAdapter } from '@nestjs/platform-express';

let cachedServer: express.Express;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.enableCors({
      credentials: true,
      origin: ['http://localhost:5173', process.env.ALLOWED_ORIGIN],
    });
    app.use(express.json());
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
