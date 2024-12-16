import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, Subject, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, PaginatorFind, ResponseResult } from 'src/app/interfaces';

import { BeneficiarioDescuentos, TarifaMultaPorRetrasosPagos, TarifaPorConsumoAgua } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {
  URL_CONFIGURACIONES = environment.apiURrl +'/configuraciones-applat';
  URL_CONFIGURACIONES_BENEFICIARIOS = this.URL_CONFIGURACIONES +'/beneficiarios';
  URL_CONFIGURACIONES_TARIFAS_POR_CONSUMO_AGUA = this.URL_CONFIGURACIONES +'/tarifa-agua';
  URL_CONFIGURACIONES_TARIFAS_MULTAS_RETRASO_PAGOS = this.URL_CONFIGURACIONES +'/tarifa-multas-retrasos-pagos';
  constructor(private http:HttpClient) { 
    this._tarifasPorConsumo$ = new Subject<DataResult<TarifaPorConsumoAgua>>();
    this._tarifasMultasPorRetrasos$ = new Subject<DataResult<TarifaMultaPorRetrasosPagos>>();
    this._beneficarios$ = new Subject<DataResult<BeneficiarioDescuentos>>();
  }

  private _tarifasPorConsumo$: Subject<DataResult<TarifaPorConsumoAgua>>;
  private _tarifasMultasPorRetrasos$: Subject<DataResult<TarifaMultaPorRetrasosPagos>>;
  private _beneficarios$: Subject<DataResult<BeneficiarioDescuentos>>;

  get tarifasPorConsumo(){
    return this._tarifasPorConsumo$.asObservable();
  }
  get tarifasMultasPorRetrasos(){
    return this._tarifasMultasPorRetrasos$.asObservable();
  }
  get beneficiarios(){
    return this._beneficarios$.asObservable();
  }

  //FUNCIONES DE TARIFAS DE COBRO POR CONSUMO DE AGUA

  findAllTarifasCobrosPorConsumo(paginator:PaginatorFind){
    const {estado,order,q,size,sort,...dataPaginator} = paginator;
    return this.http.get<HttpResponseApiArray<TarifaPorConsumoAgua>>(`${this.URL_CONFIGURACIONES_TARIFAS_POR_CONSUMO_AGUA}`,{
      params:{...dataPaginator}
    }
    ).pipe(
      tap((resp) => {
        if (resp.OK) {
          this._tarifasPorConsumo$.next(resp.data);
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
    )
  }
  registrarNuevaTarifaCobroPorConsumo(form:any){
    return this.http.post<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_POR_CONSUMO_AGUA}`,form);
  }
  updateTarifasCobroPorConsumo(idTarifa:number,form:any){
    return this.http.patch<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_POR_CONSUMO_AGUA}/${idTarifa}`,form)
  }
  updateStatusTarifasCobroPorConsumo(idTarifa:number){
    return this.http.get<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_POR_CONSUMO_AGUA}/status/${idTarifa}`)
  }
  
  //FUNCIONES PARA TARIFAS DE MULTAS POR RETRASO DE PAGOS DE SERVICIO
  
    findAllTarifasMultasPorRetrasoPago(paginator:PaginatorFind){
      const {estado,order,q,size,sort,...dataPaginator} = paginator;
      return this.http.get<HttpResponseApiArray<TarifaMultaPorRetrasosPagos>>(`${this.URL_CONFIGURACIONES_TARIFAS_MULTAS_RETRASO_PAGOS}`,{
        params:{...dataPaginator}
      }
      ).pipe(
        tap((resp) => {
          if (resp.OK) {
            this._tarifasMultasPorRetrasos$.next(resp.data);
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
      )
    }
    registrarNuevaTarifaMultasPorRetrasoPago(form:any){
      return this.http.post<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_MULTAS_RETRASO_PAGOS}`,form);
    }
    updateMultaPorRetrasoPago(idTarifa:number,form:any){
      return this.http.patch<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_MULTAS_RETRASO_PAGOS}/${idTarifa}`,form)
    }
    updateStatusTarifaMultaPorRetrasoPago(idTarifa:number){
      return this.http.get<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_TARIFAS_MULTAS_RETRASO_PAGOS}/status/${idTarifa}`)
    }

    //FUNCIONES DE BENEFICIARIOS DESCUENTOS
    findAllBeneficarios(paginator:PaginatorFind){
      const {estado,order,q,size,sort,...dataPaginator} = paginator;
      return this.http.get<HttpResponseApiArray<BeneficiarioDescuentos>>(`${this.URL_CONFIGURACIONES_BENEFICIARIOS}`,{
        params:{...dataPaginator}
      }
      ).pipe(
        tap((resp) => {
          if (resp.OK) {
            this._beneficarios$.next(resp.data);
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
      )
    }
    registrarNuevoBeneficario(form:any){
      return this.http.post<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_BENEFICIARIOS}`,form);
    }
    updateBeneficario(idBeneficiario:number,form:any){
      return this.http.patch<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_BENEFICIARIOS}/${idBeneficiario}`,form)
    }
    updateStatusBeneficiario(idBeneficiario:number){
      return this.http.get<HttpResponseApi<undefined>>(`${this.URL_CONFIGURACIONES_BENEFICIARIOS}/status/${idBeneficiario}`)
    }
}
