import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Medidor, MedidorAsociado, MedidorAsociadoForm, MesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../../interfaces/http-respones.interface';
import { Perfil } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MedidoresAguaService {

  private URL_medidores:string = environment.apiURrl + '/medidores-agua';
  private URL_medidor_asociado:string = this.URL_medidores + '/asociacion';
  private URL_planillas:string = this.URL_medidores +'/planillas';
  private URL_lecturas:string = this.URL_medidores +'/lecturas';
 
  private _AfiliadosWidthMedidores$:Subject<DataResult<Perfil>>;
  private _afiliadoWithMedidores$:Subject<Perfil>;
  private _medidor$:Subject<Medidor>;
  private _medidorAsociado$:Subject<MedidorAsociado>;
  private _medidores$:Subject<DataResult<Medidor>>;
  constructor(private http: HttpClient) {
    this._AfiliadosWidthMedidores$= new Subject<DataResult<Perfil>>();
    this._afiliadoWithMedidores$ = new Subject<Perfil>();
    this._medidor$ = new Subject<Medidor>();
    this._medidorAsociado$ = new Subject<MedidorAsociado>();
    this._medidores$ = new Subject<DataResult<Medidor>>();
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
  get medidores(){
    return this._medidores$.asObservable();
  }
  get medidorAsociado(){
    return this._medidorAsociado$.asObservable();
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
  
   //ASOCIACION
  findAllAfiliados(paginator:PaginatorFind) {
    //  console.log(paginator);
     let {size,...dataPaginator } = paginator;
      return this.http
        .get<HttpResponseApiArray<Perfil>>(`${this.URL_medidores}/afiliados`, {
          params:{...dataPaginator}
        })
        .pipe(
          tap((resp)=>{
            if(resp.OK){
              
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
  findMedidores(paginator:PaginatorFind){
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Medidor>>(`${this.URL_medidores}`, {
        params:{...dataPaginator}
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
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
      .get<HttpResponseApi<Perfil>>(`${this.URL_medidores}/afiliado/${id}`)
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
  findOneAsociacion(idAsociacion:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_medidor_asociado}/${idAsociacion}`).pipe(
      tap((resp)=>{
        if(resp.OK){
          this._medidorAsociado$.next(resp.data!)
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
  createAsociacion(asociacionForm:MedidorAsociadoForm){
    return this.http.post<HttpResponseApi<ResponseResult>>(`${this.URL_medidor_asociado}`,asociacionForm)
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

  updateAsociacion(id:number,data:MedidorAsociado){
    return this.http
      .patch<HttpResponseApi<Perfil>>(`${this.URL_medidor_asociado}/${id}`,data,)
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
  updateStatusAsociacion(idAsociacion:number,data:MedidorAsociado){
    return this.http.patch<HttpResponseApi<MedidorAsociado>>(`${this.URL_medidor_asociado}/status/${idAsociacion}`,data).
    pipe(
      tap((resp)=>{
        if(resp.OK){
          // this._afiliadoWithMedidores$.next(resp.data!)
          this._afiliadoWithMedidores$.next(resp.data!);
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
      }))
  }
  //TODO: PLANILLAS DE LECTURAS DE UN MEDIDOR
  listarPlanillasMedidor(idAsociacion:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_planillas}/${idAsociacion}`)
            .pipe(
              map(resp=>{
                  return resp.data?.planillas || [];
              })
            );
  }
  listarLecturasPlanilla(idPlanilla:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_lecturas}/${idPlanilla}`)
            .pipe(
              map(resp=>{
                  return resp.data?.lecturas || [];
              })
            );
  }
  obtenerLectura(idLectura:number){
    return this.http.get<HttpResponseApi<MesLectura>>(`${this.URL_lecturas}/comprobantes/${idLectura}`)
            .pipe(
              map(res=>res.data!)
            )
  }
}
