import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, PaginatorFind, Perfil, ResponseResult } from 'src/app/interfaces';
import { ComprobantePago, PagosForm } from 'src/app/interfaces/pagos-services.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {

  URL_deudas:string = environment.apiURrl+'/pagos-de-servicio'
  URL_comprobantes:string = environment.apiURrl +'/comprobantes'
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _perfiles$: Subject<DataResult<Perfil>>;
  private _perfil$: Subject<Perfil>;

  constructor(private http: HttpClient) {
    this._perfiles$ = new Subject<DataResult<Perfil>>();
    this._perfil$ = new Subject<Perfil>();
  }
  
  get perfiles() {
    return this._perfiles$.asObservable();
  }
  get perfil() {
    return this._perfil$.asObservable();
  }
  findAllPerfiles(paginator: PaginatorFind) {
    // console.log(paginator);
    let { size, ...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Perfil>>(`${this.URL_deudas}/perfiles`, {
        headers: this.headers,
        params: { ...dataPaginator },
      })
      .pipe(
        tap((resp) => {
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
  findOnePerfil(id: number) {
    return this.http
      .get<HttpResponseApi<Perfil>>(`${this.URL_deudas}/comprobantes-pagar/perfiles/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((resp) => {
          console.log(resp);
          if (resp.OK) {
            this._perfil$.next(resp.data!);
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
  registrarPagos(pagosForm:PagosForm){
    return this.http.post<HttpResponseApi<ComprobantePago>>(`${this.URL_deudas}/register`,pagosForm,{
      headers: this.headers,
    }).pipe(
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
}
