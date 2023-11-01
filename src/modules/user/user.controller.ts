import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    return this.userService.findById(req.user._id);
  }

  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findById(updateUserDto.userId);
    if (!user) {
      return { msg: 'User not found ' };
    }
    return this.userService.update(updateUserDto.userId, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // if (id == req.user.id) {
    //   return { msg: 'Not allow' };
    // }
    return this.userService.remove(id);
  }
}
