import { Inject, Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { URL_AUTH_REFRESH, URL_SIGNIN } from '../common/api/urls-api';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PATH_AUTH } from '../interfaces/routes-app';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('INICIA EL INTERCEPTOR AUTH');
    if(request.url === URL_SIGNIN)
    return next.handle(request);
  
    const authService = inject(AuthService);
    if(request.url === URL_AUTH_REFRESH){
      const requestClone = authService.addTokenHeader(request);
      return next.handle(requestClone);
    }

    if(authService.isRefreshing) return EMPTY;

    const dataUser = authService.getDataUser();
    if(!dataUser || !dataUser.accessToken){
      inject(Router).navigateByUrl(PATH_AUTH);
    }
    const requestClonse = authService.addTokenHeader(request);
    return next.handle(requestClonse);
  }
}
