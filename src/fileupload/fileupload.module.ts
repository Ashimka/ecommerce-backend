import { Module } from '@nestjs/common';
import { FileuploadController } from './fileupload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './static',
    }),
  ],
  controllers: [FileuploadController],
})
export class FileuploadModule {}
