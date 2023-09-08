import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Medidor, MesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../../interfaces/http-respones.interface';
import { Perfil } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MedidoresAguaService {

  private URL_medidores: string = environment.apiURrl + '/medidores-agua';
  private URL_planillas:string = this.URL_medidores +'/planillas';
  private URL_lecturas:string = this.URL_medidores +'/lecturas';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _AfiliadosWidthMedidores$:Subject<DataResult<Perfil>>;
  private _afiliadoWithMedidores$:Subject<Perfil>;
  private _medidor$:Subject<Medidor>
  constructor(private http: HttpClient) {
    this._AfiliadosWidthMedidores$= new Subject<DataResult<Perfil>>();
    this._afiliadoWithMedidores$ = new Subject<Perfil>();
    this._medidor$ = new Subject<Medidor>();
  }

  get allAfiliados(){
    return this._AfiliadosWidthMedidores$.asObservable();
  }
  get afiliadoWithMedidores(){
    return this._afiliadoWithMedidores$.asObservable();
  }
  get medidor(){
    return this._medidor$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
  //  console.log(paginator);
   let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Perfil>>(`${this.URL_medidores}/afiliados`, {
        headers:this.headers,
        params:{...dataPaginator}
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            resp.data
            this._AfiliadosWidthMedidores$.next(resp.data)
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
      .get<HttpResponseApi<Perfil>>(`${this.URL_medidores}/afiliado/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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
  findOneMedidor(idMedidor:number){
    return this.http
    .get<HttpResponseApi<Medidor>>(`${this.URL_medidores}/${idMedidor}`, {
      headers: this.headers,
    })
    .pipe(
      tap((resp)=>{
        if(resp.OK){
          this._medidor$.next(resp.data!)
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
  create(form: Medidor) {
    return this.http
      .post<HttpResponseApi<Medidor>>(`${this.URL_medidores}`, form, {
        headers: this.headers,
      })
      .pipe(
        map((resp) => {
          // console.log('map',resp);
          const respuesta:ResponseResult={OK:resp.OK,message:resp.message,statusCode:201}
          return respuesta;
        }),
        catchError((err:HttpErrorResponse) => {
          const errors = err.error as ResponseResult;
          errors.OK=false;
          return of(errors);
        })
      );
  }
  update(id: number, data: Medidor) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_medidores}/${id}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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


  updateStatus(id: number, data: Medidor) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_medidores}/status/${id}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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

  //TODO: PLANILLAS DE LECTURAS DE UN MEDIDOR
  listarPlanillasMedidor(idMedidor:number){
    return this.http.get<HttpResponseApi<Medidor>>(`${this.URL_planillas}/${idMedidor}`,{ headers: this.headers })
            .pipe(
              map(resp=>{
                  return resp.data?.planillas || [];
              })
            );
  }
  listarLecturasPlanilla(idPlanilla:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_lecturas}/${idPlanilla}`,{ headers: this.headers })
            .pipe(
              map(resp=>{
                  return resp.data?.lecturas || [];
              })
            );
  }
}
