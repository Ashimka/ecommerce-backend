import { Module } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileuploadController } from './fileupload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './assets',
    }),
  ],
  controllers: [FileuploadController],
  providers: [FileuploadService],
})
export class FileuploadModule {}
