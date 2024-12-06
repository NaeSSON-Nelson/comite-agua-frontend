import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseApi, Perfil } from 'src/app/interfaces';
import { RetrasoTipo } from 'src/app/interfaces/atributes.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  API_REPORTES_COBROS:string = environment.apiURrl + '/pagos-de-servicio';
  constructor(private readonly http:HttpClient) { }


  obtenerPagosServicio(fechaInicio:Date,fechaFin:Date){
    return this.http.get<HttpResponseApi<Perfil[]>>(`${this.API_REPORTES_COBROS}/exportar/pagos`,{
      params:{['fechaInicio']:fechaInicio.toISOString(),['fechaFin']:fechaFin.toISOString()}
    });
  }

  obtenerDeudores(retrasoTipo:RetrasoTipo){
    return this.http.get<HttpResponseApi<Perfil[]>>(`${this.API_REPORTES_COBROS}/afiliados/retrasos`,{
      params:{['tipo']:retrasoTipo}
    })
  }
}
