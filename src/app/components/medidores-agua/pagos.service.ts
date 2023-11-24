import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { DataResult, HttpResponseApi, HttpResponseApiArray, LecturasOptions, MesLectura, PaginatorFind, Perfil, ResponseResult } from 'src/app/interfaces';
import { ComprobantePorPago } from 'src/app/interfaces/pagos-services.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private URL_pagos:string = environment.apiURrl +'/pagos-de-servicio';
  private URL_comprobantes_pagos:string = this.URL_pagos +'/comprobantes';
  private URL_lecturas:string =environment.apiURrl+'/medidores-agua/lecturas';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  
  constructor(private http: HttpClient) { }
  obtenerComprobantePorPagar(idLectura:number){
    return this.http.get<HttpResponseApi<MesLectura>>(`${this.URL_comprobantes_pagos}/${idLectura}`,
    {headers:this.headers})
    .pipe(
      map(res=>res.data!)
    )
  }
  obtenerAfiliadosSinTarifa(){
    return this.http.get<HttpResponseApi<Perfil[]>>(`${this.URL_lecturas}/comprobantes/perfiles`,{
      headers: this.headers,
      // params:{gestion:parameters.gestion!,mes:parameters.mes!}
    }).pipe(
      // map(res=>res.data!)
    )
  }
  generarComprobantes(){
    return this.http.get<HttpResponseApi<ComprobantePorPago[]>>(`${this.URL_comprobantes_pagos}/generar`,{headers:this.headers})
            .pipe(
              // map(res=>res.data!)
            )
  }
}
