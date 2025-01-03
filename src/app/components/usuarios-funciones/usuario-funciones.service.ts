import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { HttpResponseApi, HttpResponseApiArray, Medidor, MultaServicio, PaginatorFind, Perfil, ResponseResult, ResponseResultData } from 'src/app/interfaces';
import { MedidorAsociado, PlanillaMesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';

import { environment } from 'src/environments/environment';
import { DataResult } from '../../interfaces/http-respones.interface';
@Injectable({
  providedIn: 'root'
})
export class UsuarioFuncionesService {

  URL_user = environment.apiURrl +'/user';
  URL_user_medidores = this.URL_user +'/medidores'
  URL_user_deudas = this.URL_user +'/deudas-medidor'
  private _deudasLecturasMedidor$:Subject<Medidor>;
  private _multasAsociacion$:Subject<DataResult<MultaServicio>>
  private _lecturasMedidor$:Subject<PlanillaLecturas>
  constructor(private http:HttpClient) {
    this._deudasLecturasMedidor$ = new Subject<Medidor>();
    this._lecturasMedidor$ = new Subject<PlanillaLecturas>();
    this._multasAsociacion$ = new Subject<DataResult<MultaServicio>>();
  }
  get deudas(){
    return this._deudasLecturasMedidor$.asObservable();
  }
  get PlanillaLecturas(){
    return this._lecturasMedidor$.asObservable();
  }
  get multasAsociacion(){
    return this._multasAsociacion$.asObservable();
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
    return this.http.get<HttpResponseApi<MedidorAsociado[]>>(`${this.URL_user_medidores}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<MedidorAsociado[]>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<MedidorAsociado[]>;
        errors.OK=false;
        return of(errors);
      })
    )
  }
  getMedidorAsociadoSelected(id:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_user_medidores}/detalles/${id}`).pipe();
  }
  getMedidor(idAsociacion:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_user_medidores}/${idAsociacion}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<MedidorAsociado>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<MedidorAsociado>;
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
    return this.http.get<HttpResponseApi<PlanillaMesLectura>>(`${this.URL_user_medidores}/lecturas/${id}`).pipe(
      map((resp) => {
        // console.log('map',resp);
        const respuesta:ResponseResultData<PlanillaMesLectura>={OK:resp.OK,message:resp.message,statusCode:200,data:resp.data!}
        return respuesta;
      }),
      catchError((err:HttpErrorResponse) => {
        const errors = err.error as ResponseResultData<PlanillaMesLectura>;
        errors.OK=false;
        return of(errors);
      })
    )
  }

  obtenerMultasMedidorAsociado(idAsociacion:number,paginator:PaginatorFind){
    const {estado,order,q,size,sort,...dataPaginator} = paginator;
    return this.http.get<HttpResponseApiArray<MultaServicio>>(`${this.URL_user_medidores}/multas/${idAsociacion}`
      ,{params:{...dataPaginator}}
    ).pipe(
      tap((resp) => {
        if (resp.OK) {
          this._multasAsociacion$.next(resp.data);
          // console.log(resp.data);
        }
      }),
      map((resp) => {
        // console.log('map',resp);
        const respuesta: ResponseResult = {
          OK: resp.OK,
          message: resp.message,
          statusCode: 200,
        };
        return respuesta;
      }),
      catchError((err: HttpErrorResponse) => {
        const errors = err.error as ResponseResult;
        errors.OK = false;
        return of(errors);
      })
    );
  }
    getDeudasPendientes(idAsociacion:number){
      return this.http.get<HttpResponseApi<{planillas:PlanillaLecturas[],multas:MultaServicio[]}>>(`${this.URL_user_deudas}/${idAsociacion}`)
    }
}
