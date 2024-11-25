import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, Subject, tap } from 'rxjs';
import { DataResult, Estado, HttpResponseApi, HttpResponseApiArray, MedidorAsociado, MedidorAsociadoForm, PaginatorFind, Perfil, ResponseResult, ResponseResultData } from 'src/app/interfaces';
import { PlanillaMesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  private _perfiles$: Subject<DataResult<Perfil>>;
  private _perfil$: Subject<Perfil>;
  
  private _medidorAsociado$:Subject<MedidorAsociado>;
  private URL_ASOCIACIONES:string = environment.apiURrl + '/asociaciones';
  constructor(private http:HttpClient) { 
    this._perfiles$ = new Subject<DataResult<Perfil>>();
    this._perfil$ = new Subject<Perfil>();
    this._medidorAsociado$ = new Subject<MedidorAsociado>();
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

  update(id:number,data:MedidorAsociado){
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
          // this._afiliadoWithMedidores$.next(resp.data!);
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
}
