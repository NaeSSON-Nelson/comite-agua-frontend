import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { HttpResponseApi, Medidor, Perfil, ResponseResult, ResponseResultData } from 'src/app/interfaces';
import { MesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuarioFuncionesService {

  URL_user = environment.apiURrl +'/user';
  URL_user_medidores = this.URL_user +'/medidores'
  private _deudasLecturasMedidor$:Subject<Medidor>;
  private _lecturasMedidor$:Subject<PlanillaLecturas>
  constructor(private http:HttpClient) {
    this._deudasLecturasMedidor$ = new Subject<Medidor>();
    this._lecturasMedidor$ = new Subject<PlanillaLecturas>();
  }
  get deudas(){
    return this._deudasLecturasMedidor$.asObservable();
  }
  get PlanillaLecturas(){
    return this._lecturasMedidor$.asObservable();
  }
  getPerfilUser(){
    return this.http.get<HttpResponseApi<Perfil>>(`${this.URL_user}/profile`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<Perfil>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<Perfil>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
  getSelectsMedidores(){
    return this.http.get<HttpResponseApi<Medidor[]>>(`${this.URL_user_medidores}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<Medidor[]>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<Medidor[]>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
  getMedidor(nroMedidor:string){
    return this.http.get<HttpResponseApi<Medidor>>(`${this.URL_user_medidores}/${nroMedidor}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<Medidor>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<Medidor>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
  getLecturasMedidor(id:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_user_medidores}/planillas/${id}`).pipe(
      tap(resp=>{
        if(resp.OK)
        this._lecturasMedidor$.next(resp.data!)
      }),
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<PlanillaLecturas>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<PlanillaLecturas>;
        errors.OK=false;
        return of(errors);
      })
    );
  }
  getDeudasMedidor(nroMedidor:string){
    return this.http.get<HttpResponseApi<Medidor>>(`${this.URL_user_medidores}/deudas/${nroMedidor}`).pipe(
      tap(resp=>{
        if(resp.OK)
        this._deudasLecturasMedidor$.next(resp.data!)
      }),
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<Medidor>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<Medidor>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
  getLectura(id:number){
    return this.http.get<HttpResponseApi<MesLectura>>(`${this.URL_user_medidores}/lecturas/${id}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<MesLectura>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<MesLectura>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
}
