import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of, tap } from "rxjs";
import { AuthRequest } from "../guards/auth.guard";
import type {  RedisClientType } from "redis"


  
  
  @Injectable()
  export class CacheInterceptor implements NestInterceptor {
    constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClientType) {}
      async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
          const req = context.switchToHttp().getRequest();
          if (req.method != 'GET') {
            return next.handle();
            }
          const key = this.generateKey(req);
          const data = await this.redis.get(key)
          if (data) {
            return of(JSON.parse(data))
          }
          return next
              .handle()
              .pipe(
                tap(async (resData) => {

                        const value = typeof resData == 'string' ? resData : JSON.stringify(resData);
                    if (!this.redis.isOpen) {
                        this.redis.connect();
                    }
                    await this.redis.set(key, value, {
                        expiration: {
                            type: "EX",
                            value: 20
                        }
                    });
                })
  
              );
      }
  
      generateKey(req: AuthRequest) {
        const url = req.path
        const queryPart = Object.keys(req.query || {}).length ? `?${JSON.stringify(req.query)}` : '';
        const userPart = req.user?._id ? `:u${req.user._id}` : '';
        const key = `http-cache:${req.method}:${url}${queryPart}${userPart}`;
        return key
    
      }
  }