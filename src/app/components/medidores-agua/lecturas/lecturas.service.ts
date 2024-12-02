import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, Perfil, ResponseResult } from 'src/app/interfaces';
import { AnioSeguimientoLecturas, LecturasOptions, lecturasRegisterForm } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {

  URL_lecturas:string =environment.apiURrl+'/medidores-agua/lecturas';
  // URL_medidores:string =environment.apiURrl+'/medidores-agua';
  URL_seguimiento:string =environment.apiURrl+'/medidores-agua/gestion/anios-seguimientos';
  URL_reportes:string = this.URL_lecturas+'/reportes'
  
  private _perfiles$: Subject<DataResult<Perfil>>;
  private _aniosSeguimientos$:Subject<AnioSeguimientoLecturas[]>;
  private _anioSeguimiento$:Subject<AnioSeguimientoLecturas>;
  constructor(private readonly http:HttpClient) {
    this._perfiles$ = new Subject<DataResult<Perfil>>();
    this._aniosSeguimientos$= new Subject<AnioSeguimientoLecturas[]>();
    this._anioSeguimiento$= new Subject<AnioSeguimientoLecturas>();
   }
  get perfilesLecturas(){
    return this._perfiles$.asObservable();
  }
  get aniosSeguimiento(){
    return this._aniosSeguimientos$.asObservable();
  }
  get anioSeguimiento(){
    return this._anioSeguimiento$.asObservable();
  }
  AllPerfilesLecturas(parameters:LecturasOptions){
    // console.log(parameters);
    // let { size, ...dataPaginator } = paginator;
    const {estado,gestion,size,mes,...dataFinders}=parameters;
    return this.http
      .get<HttpResponseApiArray<Perfil>>(`${this.URL_lecturas}/perfiles`, {
       
        params:{...dataFinders}
      })
      .pipe(
        tap((resp) => {
          console.log(resp);
          if (resp.OK) {
            this._perfiles$.next(resp.data);
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
  registerAllLecturas(registros:lecturasRegisterForm){
    return this.http.post<HttpResponseApiArray<Perfil>>(`${this.URL_lecturas}`,registros,)
            .pipe(
              map((resp) => {
                console.log('map',resp);
                const respuesta:ResponseResult={OK:resp.OK,message:resp.message,statusCode:201}
                return respuesta;
              }),
              catchError((err:HttpErrorResponse) => {
                const errors = err.error as ResponseResult;
                errors.OK=false;
                return of(errors);
              })
            )
  }
  aniosSeguimientos(){
    return this.http.get<HttpResponseApi<AnioSeguimientoLecturas[]>>(`${this.URL_seguimiento}`,)
            .pipe(
              map(resp=>{
                this._aniosSeguimientos$.next(resp.data!);
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

  //* REPORTES
  lecturasPorMes(params:LecturasOptions){
    return this.http.get<HttpResponseApi<AnioSeguimientoLecturas>>(`${this.URL_reportes}/meses`,{params:{gestion:params.gestion!}})
            .pipe(
              map(resp=>{
                this._anioSeguimiento$.next(resp.data!);
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
  PlanillasPorMes(params:LecturasOptions){
    return this.http.get<HttpResponseApiArray<Perfil>>(`${this.URL_reportes}/planillas`,{params:{gestion:params.gestion!,mes:params.mes!,barrio:params.barrio!}})
            .pipe(
              map(resp=>{
                this._perfiles$.next(resp.data!);
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
  limiteRegistrosLecturas(){
    return this.http.get<HttpResponseApi<AnioSeguimientoLecturas>>(`${this.URL_lecturas}/time`);
  }
  obtenerTiposManzanos(){
    return this.http.get<HttpResponseApi<string[]>>(`${this.URL_lecturas}/manzanos`).pipe()
  }
}
