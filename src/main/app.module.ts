import { DatabaseModule } from '@/modules/database.module';
import { Module } from '@nestjs/common';
import { I18n_Module } from '@/modules/i18n.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ClientModule, DatabaseModule, I18n_Module],
  providers: [],
})
export class AppModule {}
