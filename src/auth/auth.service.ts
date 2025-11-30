import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { loginDto, SignupDto } from './auth_dto/signup.dto';
import { compareHash } from '../common/utils/hash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const isEmailExist = await this.userModel.findOne({ email: data.email });
    if (isEmailExist) {
      throw new BadRequestException('This email already exist');
    }

    const user = await this.userModel.create(data);

    return { user };
  }

  async login(data: loginDto) {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email });
    if (!user || !(await compareHash(password, user.password))) {
      throw new BadRequestException('in-valid credentials');
    }
    const accessToken = await this.jwtService.sign({
      _id: user._id,
    },{
        secret: process.env.TOKEN_SECRET as string
    });

    return {data: {accessToken}};
  }
}
