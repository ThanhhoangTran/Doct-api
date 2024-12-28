import { Global, Module } from '@nestjs/common';
import { mongooseModules } from '../../modules/database.module';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [...mongooseModules()],
  exports: [MongooseModule],
})
export class DbConnectionModule {}
