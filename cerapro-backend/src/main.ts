import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS INTELLIGENT (Vercel + Local + Preview)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed = [
        'http://localhost:3000',
        'https://cerapro.vercel.app',
      ];

      if (
        allowed.includes(origin) ||
        origin.includes('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();