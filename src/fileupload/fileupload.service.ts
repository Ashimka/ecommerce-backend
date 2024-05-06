import { Injectable } from '@nestjs/common';
import { CreateFileuploadDto } from './dto/create-fileupload.dto';
import { UpdateFileuploadDto } from './dto/update-fileupload.dto';

@Injectable()
export class FileuploadService {
  create(createFileuploadDto: CreateFileuploadDto) {
    return 'This action adds a new fileupload';
  }

  findAll() {
    return `This action returns all fileupload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileupload`;
  }

  update(id: number, updateFileuploadDto: UpdateFileuploadDto) {
    return `This action updates a #${id} fileupload`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileupload`;
  }
}
