import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, LecturasOptions, PlanillaMesLectura, PaginatorFind, Perfil, ResponseResult } from 'src/app/interfaces';
import { ComprobantePorPago } from 'src/app/interfaces/pagos-services.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private URL_pagos:string = environment.apiURrl +'/pagos-de-servicio';
  private URL_comprobantes_pagos:string = this.URL_pagos +'/comprobantes';
  private URL_lecturas:string =environment.apiURrl+'/medidores-agua/lecturas';

  constructor(private http: HttpClient) { }
  obtenerComprobantePorPagar(idLectura:number){
    return this.http.get<HttpResponseApi<PlanillaMesLectura>>(`${this.URL_comprobantes_pagos}/${idLectura}`)
    .pipe(
      map(res=>res.data!)
    )
  }
}
