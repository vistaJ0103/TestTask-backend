import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    let user = await this.getUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const newuser = new this.userModel({
      name: createUserDto.name,
      password: hashed,
      email: createUserDto.email,
    });

    try {
      user = await newuser.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new ConflictException('User not created');
    }

    return user;
  }

  async findAll() {
    const users = await this.userModel.find().sort({ _id: -1 }).lean().exec();
    return users;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      return { msg: 'User not found ' };
    }
    return user;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (deletedUser) {
      return { msg: 'User Delete Successed' };
    }
    return { msg: 'User Delete Failed' };
  }

  async getUserByEmail(email: string) {
    let user = null;
    try {
      user = await this.userModel
        .findOne({ email }, 'name email img role password')
        .lean()
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
}
