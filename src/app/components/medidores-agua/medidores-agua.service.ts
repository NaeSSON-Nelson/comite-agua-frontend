import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Medidor, MedidorAsociado, MedidorAsociadoForm, PlanillaMesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../../interfaces/http-respones.interface';
import { Perfil } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MedidoresAguaService {

  private URL_medidores:string = environment.apiURrl + '/medidores-agua';
  private URL_planillas:string = this.URL_medidores +'/planillas';
  private URL_lecturas:string = this.URL_medidores +'/lecturas';
 

  private _medidor$:Subject<Medidor>;
  private _medidores$:Subject<DataResult<Medidor>>;
  constructor(private http: HttpClient) {
    this._medidor$ = new Subject<Medidor>();
    this._medidores$ = new Subject<DataResult<Medidor>>();
  }

  get medidor(){
    return this._medidor$.asObservable();
  }
  get medidores(){
    return this._medidores$.asObservable();
  }
 
  // MEDIDORES
  findAll(paginator:PaginatorFind) {
  //  console.log(paginator);
   let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Medidor>>(`${this.URL_medidores}`, {
        params:{...dataPaginator}
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            
            this._medidores$.next(resp.data)
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
      .post<HttpResponseApi<Medidor>>(`${this.URL_medidores}`, form,)
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
      .patch<HttpResponseApi<Medidor>>(`${this.URL_medidores}/${id}`,data,)
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


  updateStatus(id: number, data: Medidor) {
    return this.http
      .patch<HttpResponseApi<Medidor>>(`${this.URL_medidores}/status/${id}`,data)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            // this._afiliadoWithMedidores$.next(resp.data!)
            this._medidor$.next(resp.data!);
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
    .get<HttpResponseApi<Medidor>>(`${this.URL_medidores}/${idMedidor}`)
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
  // obtenerAfiliadosSinTarifa(){
  //   return this.http.get<HttpResponseApi<DataResult<Perfil>>>(`${this.URL_lecturas}/comprobantes/perfiles`).pipe(
  //     // map(res=>res.data!)
  //   )
  // }
  generarComprobantesSelected(form:any){
    return this.http.post<ResponseResult>(`${this.URL_medidores}/comprobantes-por-pagar`,form)
            .pipe(
              // map(res=>res.data!)
            )
  }
  obtenerAsociacionesMedidor(idMedidor:number){
    return this.http.get<HttpResponseApi<MedidorAsociado[]>>(`${this.URL_medidores}/asociaciones/${idMedidor}`);
  }
  findAsociacionMedidorDetails(idAsociacion:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_medidores}/asociacion/${idAsociacion}`);
    
  }
  obtenerAsociadiosMedidoresExport(){
    return this.http.get<HttpResponseApi<MedidorAsociado[]>>(`${this.URL_medidores}/lecturas/export/afiliados`).pipe();
  }
}
