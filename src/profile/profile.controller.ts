import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from '@auth/guards/role.guard';
import { Roles } from '@common/decorators';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/')
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profileService.create(createProfileDto);
  }

  @Get('/')
  async findOne(@Req() req: Request) {
    const id = req.user['id'];
    return await this.profileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
