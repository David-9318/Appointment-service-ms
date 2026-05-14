import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getValidationPipe } from './common/validation/get-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(getValidationPipe());
  await app.listen(process.env.API_PORT ?? process.env.PORT ?? 3000);
}
bootstrap();
