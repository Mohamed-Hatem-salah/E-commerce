import z from "zod";
import { loginSchema, signupSchema } from "../authValidation/signup.zod";

export type SignupDto = z.infer<typeof signupSchema> & {firstName: string , lastName:string}

export type loginDto = z.infer<typeof loginSchema>