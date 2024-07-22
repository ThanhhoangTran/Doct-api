import { DatabaseModule } from '@/modules/database.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
})
export class AppModule {}
