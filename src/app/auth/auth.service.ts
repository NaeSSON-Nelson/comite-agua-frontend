import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { of, Observer, Subject, catchError } from 'rxjs';
import { LayoutService } from '../layout/layout.service';

import { AuthResponse } from '../interfaces/auth.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpResponseApi, Menu, ResponseResult, Role } from '../interfaces';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usuario$: Subject<Usuario>;
  private _menusUser$:Subject<Menu[]>;
  constructor(
    public layoutService: LayoutService,
    private readonly http: HttpClient
  ) {
    this._usuario$ = new Subject<Usuario>();
    this._menusUser$= new Subject<Menu[]>();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  get usuario() {
    return this._usuario$.asObservable();
  }
  get menusUser(){
    return this._menusUser$.asObservable();
  }
  URL_Auth: string = environment.apiURrl + '/auth';
  validarToken() {
    const headers = new HttpHeaders().set(
      'authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http
      .get<AuthResponse>(`${this.URL_Auth}/refresh`, { headers })
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._usuario$.next(resp.usuario);
            localStorage.setItem('token', resp.token!);
          }
        }),
        map((resp) => {
          return resp.OK;
        }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
  login(usuario: Usuario) {
    
    return this.http.post<AuthResponse>(`${this.URL_Auth}/login`, usuario).pipe(
      tap((resp) => {
        if (resp.OK) {
          localStorage.setItem('token', resp.token!);
          this._usuario$.next(resp.usuario);
        }
      }),
      map((resp) => resp.OK),
      catchError((err) => of(false))
    );
  }

  //TODO: UN GUARD QUE VALIDE EL ACCESO AL RECURSO
  // validarAcceso(){
  //   const headers = new HttpHeaders().set(
  //     'authorization',
  //     `Bearer ${localStorage.getItem('token') || ''}`
  //   );
  //   return this.http
  //     .get<any>(`${this.URL_Auth}/access-valid`, { headers })
  //     .pipe(
  //       tap((resp) => {
  //         console.log(resp);
  //       }),
  //       map((resp) => {
  //         // localStorage.setItem('token', resp.token!);
  //         // this._usuario$.next(resp.usuario);
  //         return false;
  //       }),
  //       catchError((err) => {
  //         console.log(err);
  //         return of(false);
  //       })
  //     );
  // }

  getMenusUser(idRole:number){
    const headers = new HttpHeaders().set(
      'authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.get<HttpResponseApi<Role>>(`${this.URL_Auth}/roles/${idRole}`,{ headers })
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
    )

  }
}
