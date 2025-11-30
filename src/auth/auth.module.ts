import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModel } from "../models/user.model";
import { JwtService } from "@nestjs/jwt";



@Module({
    imports: [UserModel],
    providers: [AuthService , JwtService],
    controllers: [AuthController],
})

export class AuthModule{}

