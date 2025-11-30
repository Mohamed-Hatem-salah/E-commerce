import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';


@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        return next
            .handle()
            .pipe(
                map((resData) => {
                    const { message = 'success', data = {}, status = 200 } = resData;
                    return { message, data, status };
                })
            );
    }
}
