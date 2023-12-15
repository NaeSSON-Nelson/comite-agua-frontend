import { EventEmitter, Inject, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { of, Observer, Subject, catchError } from 'rxjs';
import { LayoutService } from '../layout/layout.service';

import { AuthResponse, IDataUser, IResponseRefreshToken } from '../interfaces/auth.interface';
import {  Usuario } from '../interfaces/usuario.interface';
import { HttpResponseApi, Menu, ResponseResult, Role } from '../interfaces';
import { LocalStorageService } from '../common/storage/local-storage.service';
import { KEY_STORAGE } from '../interfaces/storage.enum';
import { URL_AUTH_REFRESH } from '../common/api/urls-api';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usuario$: Subject<Usuario | null>;
  private _menusUser$: Subject<Menu[]>;
  private _usuario: Usuario | null = null;

  usuarioLog: EventEmitter<Usuario | null> = new EventEmitter<Usuario | null>();
  constructor(
    public layoutService: LayoutService,
    private readonly localStorageService:LocalStorageService,
    private readonly http: HttpClient,
    private readonly router:Router,
  ) {
    this._usuario$ = new Subject<Usuario | null>();
    this._menusUser$ = new Subject<Menu[]>();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  get user() {
    return { ...this._usuario };
  }
  get usuario() {
    return this._usuario$.asObservable();
  }
  get menusUser() {
    return this._menusUser$.asObservable();
  }
  URL_Auth: string = environment.apiURrl + '/auth';
  validarToken() {
    return this.http.get<AuthResponse>(`${this.URL_Auth}/refresh`);
  }
  login(usuario: Usuario) {
    return this.http.post<AuthResponse>(`${this.URL_Auth}/login`, usuario);
  }
  refreshToken(){
    return this.http.get<IResponseRefreshToken>(`${this.URL_Auth}/refresh`);
  }
  logout() {
    this.localStorageService.removeItem(KEY_STORAGE.DATA_USER);
    this.layoutService.userObserver.next(null);
    this.router.navigateByUrl('');
  }
  getMenusUser(idRole: number) {
    return this.http.get<HttpResponseApi<Role>>(`${this.URL_Auth}/roles/${idRole}`)
    .pipe(
      tap((resp)=>{
        if(resp.OK){
          this._menusUser$.next(resp.data!.menus || []);
        }
      }),
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResult={OK:resp.OK,message:resp.message,statusCode:200}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResult;
        errors.OK=false;
        return of(errors);
      })
    );
  }

  private _isRefreshing = false;
  public get isRefreshing() {
    return this._isRefreshing;
  }
  public set isRefreshing(value) {
    this._isRefreshing = value;
  }
  getDataUser() {
		return this.localStorageService.getItem<IDataUser>(KEY_STORAGE.DATA_USER)!;
	}

  getUser(){
    return this.http.get<HttpResponseApi<Usuario>>(`${this.URL_Auth}/user`).pipe();
  }
  addTokenHeader(request: HttpRequest<unknown>) {
		const user = this.getDataUser();
		// const token = request.url === URL_AUTH_REFRESH ? user.refreshToken : user.accessToken;

    return request.url === URL_AUTH_REFRESH?
    request.clone({ headers: request.headers.set('refresh', user.refreshToken) }):
    request.clone({ headers: request.headers.set('authorization', `Bearer ${user.accessToken}`) });
	}

	updateTokens(token: string, refreshToken: string) {
		const user = this.getDataUser();
		user.accessToken = token;
		user.refreshToken = refreshToken;
		this.localStorageService.setItem(KEY_STORAGE.DATA_USER, user);
	}

}
