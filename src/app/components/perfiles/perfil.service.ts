import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  PaginatorFind,
  Perfil,
  Afiliado,
  AfiliadoForm,
  UsuarioForm,
  Usuario,
  DataResult,
  HttpResponseApiArray,
  ResponseResult,
  HttpResponseApi,
  PerfilForm,
  ResponseCreatePerfil,
  ResponseResultData,
} from 'src/app/interfaces';
import { BeneficiarioDescuentos } from 'src/app/interfaces/opciones-confuguraciones.interface';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  URL_perfil: string = environment.apiURrl + '/perfiles';
  URL_afiliado: string = this.URL_perfil + '/afiliado';
  URL_usuario: string = this.URL_perfil + '/usuario';
  private _perfiles$: Subject<DataResult<Perfil>>;
  private _perfil$: Subject<Perfil>;
  private _afiliadoSelected$: Subject<Afiliado>;

  constructor(private http: HttpClient) {
    this._perfiles$ = new Subject<DataResult<Perfil>>();
    this._perfil$ = new Subject<Perfil>();
    this._afiliadoSelected$ = new Subject<Afiliado>();
  }

  get perfiles() {
    return this._perfiles$.asObservable();
  }
  get perfil() {
    return this._perfil$.asObservable();
  }

  get afiliado() {
    return this._afiliadoSelected$.asObservable();
  }
  findAll(paginator: PaginatorFind) {
    // console.log(paginator);
    let { size, ...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Perfil>>(`${this.URL_perfil}`, {
        params: { ...dataPaginator },
      })
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._perfiles$.next(resp.data);
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
      );
  }
  findPerfilesExport(pag:any){
    const {size,q,estado,...dataPaginator}=pag;
    return this.http.get<HttpResponseApi<Perfil[]>>(`${this.URL_perfil}/export`
      ,{params:{...dataPaginator}}
    )
    .pipe();
  }
  uploadImageProfile(file: File,id:number) {
    const formParams = new FormData();
    formParams.append('file', file);
    formParams.append('id',id.toString());
    return this.http.post<any>(`${this.URL_perfil}/upload-image-user`, formParams,{
    })
  }
  findOne(id: number) {
    return this.http
      .get<HttpResponseApi<Perfil>>(`${this.URL_perfil}/${id}`)
      .pipe(
        tap((resp) => {
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
  findOnePerfilUsuario(idPerfil: number) {
    return this.http
      .get<HttpResponseApi<Perfil>>(`${this.URL_usuario}/${idPerfil}`)
      .pipe(
        tap((resp) => {
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
  findOnePerfilAfiliado(idPerfil: number) {
    return this.http
      .get<HttpResponseApi<Perfil>>(`${this.URL_afiliado}/${idPerfil}`)
      .pipe(
        tap((resp) => {
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

  create(form: PerfilForm) {
    return this.http
      .post<HttpResponseApi<ResponseCreatePerfil>>(`${this.URL_perfil}`, form,)
      .pipe(
        map((resp) => {
          // console.log('map',resp);
          const respuesta: ResponseResultData<ResponseCreatePerfil> = {
            OK: resp.OK,
            message: resp.message,
            statusCode: 201,
            data: resp.data,
          };
          return respuesta;
        }),
        catchError((err: HttpErrorResponse) => {
          const errors = err.error as ResponseResultData<ResponseCreatePerfil>;
          errors.OK = false;
          return of(errors);
        })
      );
  }
  createUsuario(idPerfil: number, form: UsuarioForm) {
    return this.http
      .post<HttpResponseApi<ResponseCreatePerfil>>(`${this.URL_usuario}/${idPerfil}`, form)
      .pipe(
        map((resp) => {
          // console.log('map',resp);
          const respuesta: ResponseResultData<ResponseCreatePerfil> = {
            OK: resp.OK,
            message: resp.message,
            statusCode: 201,
            data: resp.data,
          };
          return respuesta;
        }),
        catchError((err: HttpErrorResponse) => {
          const errors = err.error as ResponseResultData<ResponseCreatePerfil>;
          errors.OK = false;
          return of(errors);
        })
      );
  }
  createAfiliado(idPerfil: number, form: AfiliadoForm) {
    return this.http
      .post<HttpResponseApi<Perfil>>(`${this.URL_afiliado}/${idPerfil}`, form)
      .pipe(
        map((resp) => {
          // console.log('map',resp);
          const respuesta: ResponseResult = {
            OK: resp.OK,
            message: resp.message,
            statusCode: 201,
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
  update(id: number, form: PerfilForm) {
    return this.http
      .patch<HttpResponseApi<Perfil>>(`${this.URL_perfil}/${id}`, form)
      .pipe(
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
  updateAfiliado(idPerfil: number, form: AfiliadoForm) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_afiliado}/${idPerfil}`,
        form
      )
      .pipe(
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
  updatePagarAfiliado(idPerfil:number,form:Afiliado){
    return this.http.patch<HttpResponseApi<null>>(`${this.URL_afiliado}/pago/${idPerfil}`,form).pipe();
  }
  updateAfiliadoStatus(idPerfil: number, form: Afiliado) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_afiliado}/status/${idPerfil}`,
        form
      )
      .pipe(
        tap((resp) => {
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
  updateStatus(idPerfil: number, form: AfiliadoForm) {
    return this.http
      .patch<HttpResponseApi<Perfil>>(
        `${this.URL_perfil}/status/${idPerfil}`,
        form
      )
      .pipe(
        tap((resp) => {
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
  updateUsuario(idPerfil: number, form: UsuarioForm) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_usuario}/${idPerfil}`,
        form
      )
      .pipe(
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
  updateUsuarioStatus(idPerfil: number, form: UsuarioForm) {
    return this.http
      .patch<HttpResponseApi<Usuario>>(
        `${this.URL_usuario}/status/${idPerfil}`,
        form
      )
      .pipe(
        tap((resp) => {
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

  obtenerDatosPago(perfilId:number){
    return this.http.get<HttpResponseApi<Afiliado>>(`${this.URL_afiliado}/pago/${perfilId}`).pipe();
  }

  registrarPagoPresencial(form:Afiliado){
    return this.http.post<HttpResponseApi<Afiliado>>(`${this.URL_afiliado}/pagar/presencial`,form).pipe();
  }
  registrarPagoDeposito(form:Afiliado){
    return this.http.post<HttpResponseApi<null>>(`${this.URL_afiliado}/pagar/deposito`,form).pipe();
  }
  obtenerBeneficiosDescuentos(){
    return this.http.get<HttpResponseApi<BeneficiarioDescuentos[]>>(`${this.URL_perfil}/afiliados/beneficiarios`);
  }
}
