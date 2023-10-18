import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, PaginatorFind, Perfil, ResponseResult } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private URL_pagos:string = environment.apiURrl +'/pagos-de-servicio';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _Afiliados$:Subject<DataResult<Perfil>>;
  private _afiliado$:Subject<Perfil>;
  constructor(private http: HttpClient) { 
    
    this._Afiliados$= new Subject<DataResult<Perfil>>();
    this._afiliado$= new Subject<Perfil>();
  }
  get afiliados(){
    return this._Afiliados$.asObservable();
  }

  get afiliado(){
    return this._afiliado$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
    //  console.log(paginator);
     let {size,...dataPaginator } = paginator;
      return this.http
        .get<HttpResponseApiArray<Perfil>>(`${this.URL_pagos}/afiliados`, {
          headers:this.headers,
          params:{...dataPaginator}
        })
        .pipe(
          tap((resp)=>{
            if(resp.OK){
              resp.data
              this._Afiliados$.next(resp.data)
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
  
    findOne(id: number) {
      return this.http
        .get<HttpResponseApi<Perfil>>(`${this.URL_pagos}/afiliados/${id}`, {
          headers: this.headers,
        })
        .pipe(
          tap((resp)=>{
            if(resp.OK){
              this._afiliado$.next(resp.data!)
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
}
