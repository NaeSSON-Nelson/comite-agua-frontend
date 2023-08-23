import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApiArray, Perfil, ResponseResult } from 'src/app/interfaces';
import { LecturasOptions, lecturasRegisterForm } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {

  URL_lecturas:string =environment.apiURrl+'/medidores-agua/lecturas';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _perfiles$: Subject<DataResult<Perfil>>;
  constructor(private readonly http:HttpClient) {
    this._perfiles$ = new Subject<DataResult<Perfil>>();
   }
  get perfilesLecturas(){
    return this._perfiles$.asObservable();
  }
  AllPerfilesLecturas(parameters:LecturasOptions){
    console.log(parameters);
    // let { size, ...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Perfil>>(`${this.URL_lecturas}/perfiles`, {
        headers: this.headers,
        params: { ...parameters },
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
    return this.http.post<HttpResponseApiArray<Perfil>>(`${this.URL_lecturas}`,registros,{headers:this.headers})
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
}
