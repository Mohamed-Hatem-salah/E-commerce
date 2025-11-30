import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { SignupDto } from "../../auth/auth_dto/signup.dto";

@Injectable()
export class CheckPasswordPipe implements PipeTransform {
    transform(value: SignupDto, metadata: ArgumentMetadata) {
        console.log({ value, metadata });
        
        if (value.password !== value.repeatPassword) {
            throw new BadRequestException('password must equal repeatPassword');
        }
        
        return value;
    }
}