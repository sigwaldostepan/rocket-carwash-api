import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes/validation.pipe';
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

// Vercel serverless handler
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

// Fallback for local development (nest start --watch / pnpm run dev)
if (!process.env.VERCEL) {
  bootstrap().then((server) => {
    server.listen(process.env.PORT ?? 3300, () => {
      console.log(`Local dev server listening on port ${process.env.PORT ?? 3300}`);
    });
  });
}
