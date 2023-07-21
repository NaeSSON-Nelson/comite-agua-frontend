import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Perfil, Usuario, UsuarioForm } from 'src/app/interfaces/usuario.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  URL_usuario: string = environment.apiURrl + '/usuarios';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _usuarios$:Subject<DataResult<Usuario>>;
  private _usuarioSelected$:Subject<Usuario>;
  constructor(private http: HttpClient) {
    this._usuarios$= new Subject<DataResult<Usuario>>();
    this._usuarioSelected$ = new Subject<Usuario>();
  }

  get usuarios(){
    return this._usuarios$.asObservable();
  }
  get usuario(){
    return this._usuarioSelected$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
  //  console.log(paginator);
   let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Usuario>>(`${this.URL_usuario}`, {
        headers:this.headers,
        params:{...dataPaginator}
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            resp.data
            this._usuarios$.next(resp.data)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }

  findOne(id: number) {
    return this.http
      .get<HttpResponseApi<Usuario>>(`${this.URL_usuario}/user/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._usuarioSelected$.next(resp.data!)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  create(form: UsuarioForm) {
    return this.http
      .post<HttpResponseApi<Usuario>>(`${this.URL_usuario}/create`, form, {
        headers: this.headers,
      })
      .pipe(
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  updateProfile(idUsuario: number, data: Perfil) {
    return this.http
      .patch<HttpResponseApi<Usuario>>(
        `${this.URL_usuario}/profile/${idUsuario}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._usuarioSelected$.next(resp.data!)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  updateRoles(idUsuario: number, roles: number[]) {
    return this.http
      .patch<HttpResponseApi<Usuario>>(
        `${this.URL_usuario}/asignar-roles/${idUsuario}`,
        roles,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._usuarioSelected$.next(resp.data!)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }



  updateStatus(id: number, data: Usuario) {
    return this.http
      .patch<HttpResponseApi<Usuario>>(
        `${this.URL_usuario}/status/${id}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._usuarioSelected$.next(resp.data!)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
}
