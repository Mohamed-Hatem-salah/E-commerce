import { compare, hash } from 'bcrypt';

export const createHash = async (password: string):Promise<string> => {
  return await hash(password , +(process.env.SALT as string));
};

export const compareHash = async(text:string ,hashedText: string):Promise<boolean>=>{
    return await compare(text ,hashedText)
}