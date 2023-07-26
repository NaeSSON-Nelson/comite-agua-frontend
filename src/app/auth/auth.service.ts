import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { of, Observer, Subject, catchError } from 'rxjs';
import { LayoutService } from '../layout/layout.service';

import { AuthResponse } from '../interfaces/auth.interface';
import { Usuario } from '../interfaces/usuario.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usuario$: Subject<Usuario>;
  constructor(
    public layoutService: LayoutService,
    private readonly http: HttpClient
  ) {
    this._usuario$ = new Subject<Usuario>();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  get usuario() {
    return this._usuario$.asObservable();
  }
  URL_Auth: string = environment.apiURrl + '/auth';

  login(usuario: Usuario) {
    return this.http.post<AuthResponse>(`${this.URL_Auth}/login`, usuario).pipe(
      tap((resp) => {
        if (resp.OK) {
          // console.log(resp);
          localStorage.setItem('token', resp.token!);
          this._usuario$.next(resp.usuario);
        }
      }),
      map((resp) => resp.OK),
      catchError((err) => of(false))
    );
  }
  validarToken() {
    const headers = new HttpHeaders().set(
      'authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http
      .get<AuthResponse>(`${this.URL_Auth}/refresh`, { headers })
      .pipe(
        tap((resp) => {
          // console.log(resp);
          if (resp.OK) {
            this._usuario$.next(resp.usuario);
          }
        }),
        map((resp) => {
          localStorage.setItem('token', resp.token!);
          this._usuario$.next(resp.usuario);
          // console.log('map: ',resp);
          return resp.OK;
        }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }

  validarAcceso(){
    const headers = new HttpHeaders().set(
      'authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http
      .get<any>(`${this.URL_Auth}/access-valid`, { headers })
      .pipe(
        tap((resp) => {
          console.log(resp);
        }),
        map((resp) => {
          // localStorage.setItem('token', resp.token!);
          // this._usuario$.next(resp.usuario);
          return false;
        }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
}
