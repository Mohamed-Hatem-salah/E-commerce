import { GenderEnum, ProviderENUM, RolesEnum } from '../../types/user.type';
import { z } from 'zod';

export const signupSchema = z.strictObject({
    email: z.email(),
    password: z.string().min(8),
    repeatPassword: z.string().min(8),
    username: z.string().min(3).max(30),
    age: z.int().optional(),
    phone: z.string().optional(),
    role: z.enum(Object.values(RolesEnum)).default(RolesEnum.USER),
    gender: z.enum(Object.values(GenderEnum)).default(GenderEnum.MALE),
    provider: z.enum(Object.values(ProviderENUM)).default(ProviderENUM.SYSTEM),
  })
  .superRefine((args, ctx) => {
    if (args.password !== args.repeatPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'password must equal repeat password',
      });
    }
  });


  export const loginSchema = z.object({
    password: z.string(),
    email: z.string()
  })