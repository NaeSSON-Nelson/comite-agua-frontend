import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { EMPTY, Observable, catchError, concatMap, finalize, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorApiInterceptor implements HttpInterceptor {

  constructor(private readonly authService:AuthService,
              private readonly messageService: MessageService,
              private readonly router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        /** MANEJAR LOS ERRORES */
          if(error.status === HttpStatusCode.Unauthorized){
            this.authService.isRefreshing = true;
            return  this.authService.refreshToken().pipe(
              finalize(()=>{
                this.authService.isRefreshing=false;
              }),
              concatMap((res)=>{
                this.authService.updateTokens(res.accessToken,res.refreshToken)
                console.log('******** TOKENS ACTUALIZADOS ********');
                const requestClone = this.authService.addTokenHeader(request);
                return next.handle(requestClone);
              }),catchError(()=>{
                console.error('******** ERROR UPDATE TOKENS ********');
                this.router.navigateByUrl('/auth/login');
                return EMPTY
              }))
            }else if(error.status === HttpStatusCode.BadRequest){
              
              // console.info('******** BAD REQUEST ********');
              // console.log(error);
              this.messageService.add({life:2000,summary:'bad request',detail:error.error.message,severity: 'warn',})
            }else if(error.status === HttpStatusCode.Forbidden){
              // console.info('******** FORBIDDEN ********');
              // console.log(error);
              this.messageService.add({life:3000,summary:error.error.error,detail:error.error.message,severity: 'info',})
              this.router.navigateByUrl('/dashboara')
            } else if (error.status === HttpStatusCode.NotFound){
              this.messageService.add({life:3000,summary:error.error.error,detail:error.error.message,severity: 'info',})

            }
        return throwError(()=> error)
      })
    );
  }
}
