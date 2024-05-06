import { PartialType } from '@nestjs/mapped-types';
import { CreateFileuploadDto } from './create-fileupload.dto';

export class UpdateFileuploadDto extends PartialType(CreateFileuploadDto) {}
