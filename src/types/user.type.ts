import { HydratedDocument } from "mongoose";





export interface IUser {

    firstName: string;
    lastName: string;
    email: string;
    phone: string; 
    password: string;
    age: number;
    credentialChangeAt: Date;
    emailOtp: IOtp;
    passwordOtp: IOtp;
    

    role:RolesEnum;
    gender:GenderEnum;
    provider:ProviderENUM;
}

export type HydratedUser = HydratedDocument<IUser>;

export interface IOtp {
    otp: number;
    expiresAt: Date;
}


export enum RolesEnum {
    USER = 'user',
    ADMIN = 'admin'
}


export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female'
}

export enum ProviderENUM{
    GOOGLE='google',
    SYSTEM ='system'
}