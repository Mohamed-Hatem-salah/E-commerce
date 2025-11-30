import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { GenderEnum, type IOtp, IUser, ProviderENUM, RolesEnum } from "../types/user.type";
import { createHash } from "../common/utils/hash";
import { hashSync } from "bcrypt";

@Schema({
    timestamps: true
})


export class User implements IUser {

    @Prop({
        type: String,
        required: [true, 'First name is required'],
        min: [2, 'First name must be at least 2 characters'],
    })
    firstName: string;

    @Prop({
        type: String,
        required: [true, 'Last name is required'],
        min: [2, 'Last name must be at least 2 characters'],
    })
    lastName: string;


    @Virtual({
        get(this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            const firstName = value.split(' ')[0];
            const lastName = value.split(' ')[1];
            this.set({ firstName, lastName });
        }
    })
    username: string; 

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        set: function(value: string){
            
            const hashedPassword = hashSync(value , +(process.env.SALT as string));

            return hashedPassword;
        }
    })
    password: string;

    @Prop({
        type: Number
    })
    age: number;

    @Prop({
        type: Date
    })
    credentialChangeAt: Date;
    
    @Prop({
        type: Object
    })
    emailOtp: IOtp;
    
    @Prop({
        type: Object
    })
    passwordOtp: IOtp;
    
    @Prop({
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    })
    gender: GenderEnum;
    
    @Prop({
        type: String,
        enum: Object.values(ProviderENUM),
        default: ProviderENUM.SYSTEM
    })
    provider: ProviderENUM;
    
    @Prop({
        type: String
    })
    phone: string;
    
    @Prop({
        type: String,
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER
    })
    role: RolesEnum;
}

const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
]);
