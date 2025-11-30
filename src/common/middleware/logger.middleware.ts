// import { Injectable, NestMiddleware } from "@nestjs/common";

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//     use(req: any, res: any, next: (error?: any) => void) {
//         console.log(`${req.method} ${req.url} ${req.ip} ${new Date()}`);
//         next();
//     }
// }

import { Request, Response, NextFunction } from 'express';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url} ${req.ip} ${new Date()}`);
    next();
}