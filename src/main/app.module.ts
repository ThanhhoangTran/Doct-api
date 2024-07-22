import { DatabaseModule } from '@/modules/database.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { I18n_Module } from '@/modules/i18n.module';

@Module({
  imports: [DatabaseModule, I18n_Module],
  controllers: [AppController],
})
export class AppModule {}
