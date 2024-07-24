import { NestFactory } from '@nestjs/core';
import { AppModule } from '../main/app.module';
import { configuration } from '@/config';
import { Logger } from '@nestjs/common';
import { APP_ENV } from '@/common/constants';

async function bootstrap() {
  const { port, domain, api } = configuration;
  const isDevelopment = api.nodeEnv === APP_ENV.LOCAL;
  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(port);

    isDevelopment
      ? (Logger.log(`Server is running on: 🚀🚀🚀${await app.getUrl()} 🚀🚀🚀`),
        Logger.log(
          `Client server on: 🚀🚀🚀 http://${domain}:${port}/playground/client 🚀🚀🚀 `,
        ),
        Logger.log(
          `Admin server on: 🚀🚀🚀 http://${domain}:${port}/playground/admin 🚀🚀🚀 `,
        ))
      : Logger.log(`Server is listening on port: ${port} 🚀🚀🚀`);
  } catch (error) {
    process.exit(1);
  }
}
bootstrap();
