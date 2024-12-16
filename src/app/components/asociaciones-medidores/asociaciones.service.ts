import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, Subject, tap } from 'rxjs';
import { DataResult, Estado, HttpResponseApi, HttpResponseApiArray, MedidorAsociado, MedidorAsociadoForm, MultaServicio, PaginatorFind, Perfil, ResponseResult, ResponseResultData } from 'src/app/interfaces';
import { PlanillaMesLectura, PlanillaLecturas, HistorialConexiones } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  private _perfiles$: Subject<DataResult<Perfil>>;
  private _perfil$: Subject<Perfil>;
  private _cortes$:Subject<DataResult<HistorialConexiones>>
  // private _AfiliadosWidthMedidores$:Subject<DataResult<Perfil>>;
  // private _afiliadoWithMedidores$:Subject<Perfil>;
  private _medidorAsociado$:Subject<MedidorAsociado>;
  private _multasAsociado$:Subject<DataResult<MultaServicio>>
  private URL_ASOCIACIONES:string = environment.apiURrl + '/asociaciones';
  constructor(private http:HttpClient) { 
    // this._AfiliadosWidthMedidores$= new Subject<DataResult<Perfil>>();
    // this._afiliadoWithMedidores$ = new Subject<Perfil>();
    this._perfiles$ = new Subject<DataResult<Perfil>>();
    this._perfil$ = new Subject<Perfil>();
    this._medidorAsociado$ = new Subject<MedidorAsociado>();
    this._cortes$ = new Subject<DataResult<HistorialConexiones>>();
    this._multasAsociado$ = new Subject<DataResult<MultaServicio>>();
  }

  get perfiles() {
    return this._perfiles$.asObservable();
  }
  get perfil() {
    return this._perfil$.asObservable();
  }
  get medidorAsociado(){
    return this._medidorAsociado$.asObservable();
  }

  get historialCortes(){
    return this._cortes$.asObservable();
  }
  get multasAsociado(){
    return this._multasAsociado$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
     let {size,...dataPaginator } = paginator;
      return this.http
        .get<HttpResponseApiArray<Perfil>>(`${this.URL_ASOCIACIONES}`, {
          params:{...dataPaginator}
        })
        .pipe(
          tap((resp)=>{
            if(resp.OK){
              
              this._perfiles$.next(resp.data)
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
  
  findOne(id:number){
    return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_ASOCIACIONES}/${id}`).pipe(
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
  findOnePerfil(idPerfil:number){
    return this.http.get<HttpResponseApi<Perfil>>(`${this.URL_ASOCIACIONES}/perfil/${idPerfil}`).pipe(
      tap((resp)=>{
        if(resp.OK){
          this._perfil$.next(resp.data!)
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
  findGestiones(id:number,paginator:PaginatorFind){
    const {estado,order,q,size,sort,...dataPagi}=paginator;
    return this.http.get<HttpResponseApiArray<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/list/gestiones/${id}`,{
      params:{...dataPagi}
    }).pipe()
  }
  findGestion(idAsociacion:number,gestion:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/gestion/${idAsociacion}/${gestion}`);
  }
  findGestionActual(idAsociacion:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/gestion/${idAsociacion}`);
  }
  create(asociacionForm:MedidorAsociadoForm){
    return this.http.post<HttpResponseApi<ResponseResult>>(`${this.URL_ASOCIACIONES}`,asociacionForm)
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
  createGestion(formGestion:any){
    return this.http.post<HttpResponseApi<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/gestion`,formGestion);
  }

  update(id:number,data:MedidorAsociadoForm){
    return this.http
      .patch<HttpResponseApi<Perfil>>(`${this.URL_ASOCIACIONES}/${id}`,data,)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            // this._afiliadoWithMedidores$.next(resp.data!)
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
  updateStatus(idAsociacion:number,data:MedidorAsociado){
    return this.http.patch<HttpResponseApi<MedidorAsociado>>(`${this.URL_ASOCIACIONES}/status/${idAsociacion}`,data).
    pipe(
      tap((resp)=>{
        if(resp.OK){
          // this._afiliadoWithMedidores$.next(resp.data!)
          this._medidorAsociado$.next(resp.data!);
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
  return this.http.get<HttpResponseApi<MedidorAsociado>>(`${this.URL_ASOCIACIONES}/gestiones/${idAsociacion}`)
    .pipe(
      map(resp=>{
          return resp.data?.planillas || [];
      })
    );
  }
  
  listarLecturasPlanilla(idPlanilla:number){
    return this.http.get<HttpResponseApi<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/lecturas/${idPlanilla}`)
            .pipe(
              map(resp=>{
                  return resp.data?.lecturas || [];
              })
            );
  }
  obtenerLectura(idLectura:number){
    return this.http.get<HttpResponseApi<PlanillaMesLectura>>(`${this.URL_ASOCIACIONES}/lectura/${idLectura}`)
            .pipe(
              map(res=>res.data!)
            )
  }
  updateStatusGestion(idPlanilla:number,registrable:boolean){
    return this.http.patch<HttpResponseApi<PlanillaLecturas>>(`${this.URL_ASOCIACIONES}/gestion/${idPlanilla}`,{registrable});
  }
  obtenerAsociacionesAfiliado(idPerfil:number){
    return this.http.get<HttpResponseApi<MedidorAsociado[]>>(`${this.URL_ASOCIACIONES}/afiliado/${idPerfil}`).pipe();
  }

  obtenerComprobantePorPagar(idLectura:number){
    return this.http.get<HttpResponseApi<PlanillaMesLectura>>(`${this.URL_ASOCIACIONES}/comprobantes-lectura/${idLectura}`)
    .pipe(
      map(res=>res.data!)
    )
  }
  obtenerHistorialCortes(idAsociacion:number,paginator:PaginatorFind){
    const {estado,order,q,size,sort,...dataPaginatorSend}=paginator;
    return this.http.get<HttpResponseApiArray<HistorialConexiones>>(`${this.URL_ASOCIACIONES}/historial-conexiones/${idAsociacion}`,
      {params:{...dataPaginatorSend}}
    ).pipe(tap((resp)=>{
      if(resp.OK){
        this._cortes$.next(resp.data)
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
  obtenerMultasAsociado(idAsociacion:number,paginator:PaginatorFind){
    const {estado,order,q,size,sort,...dataPaginatorSend}=paginator;
    return this.http.get<HttpResponseApiArray<MultaServicio>>(`${this.URL_ASOCIACIONES}/multas/${idAsociacion}`,
      {params:{...dataPaginatorSend}}
    ).pipe(tap((resp)=>{
      if(resp.OK){
        this._multasAsociado$.next(resp.data)
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
  obtenerMultaDetalles(idMulta:number){
    return this.http.get<HttpResponseApi<MultaServicio>>(`${this.URL_ASOCIACIONES}/multa/${idMulta}`)
  }
  solicitudCorte(idAsociacion:number,form:any){
    return this.http.patch<HttpResponseApi<null>>(`${this.URL_ASOCIACIONES}/solicitar-corte/${idAsociacion}`,form).pipe();
  }
  cancelarSolicitudCorte(idAsociacion:number){
    return this.http.get<HttpResponseApi<null>>(`${this.URL_ASOCIACIONES}/corte-cancelar/${idAsociacion}`);
  }
  solicitudReconexion(idAsociacion:number,form:any){
    return this.http.patch<HttpResponseApi<null>>(`${this.URL_ASOCIACIONES}/solicitar-reconexion/${idAsociacion}`,form);
  }
  cancelarSolicitudReconexion(idAsociacion:number){
    return this.http.get<HttpResponseApi<null>>(`${this.URL_ASOCIACIONES}/reconexion-cancelar/${idAsociacion}`);
  }

}
