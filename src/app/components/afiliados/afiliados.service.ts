import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import {
  DataResult,
  HttpResponseApi,
  HttpResponseApiArray,
} from 'src/app/interfaces/http-respones.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AfiliadosService {
  URL_afiliado: string = environment.apiURrl + '/afiliados';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _afiliados$: Subject<DataResult<Afiliado>>;
  private _afiliadoSelected$: Subject<Afiliado>;

  constructor(private http: HttpClient) {
    this._afiliados$ = new Subject<DataResult<Afiliado>>();
    this._afiliadoSelected$ = new Subject<Afiliado>();
  }

  get afiliados() {
    return this._afiliados$.asObservable();
  }
  get afiliado() {
    return this._afiliadoSelected$.asObservable();
  }
  findAll(paginator: PaginatorFind) {
    console.log(paginator);
    let { size, ...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Afiliado>>(`${this.URL_afiliado}`, {
        headers: this.headers,
        params: { ...dataPaginator },
      })
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._afiliados$.next(resp.data);
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }

  findOne(id: number) {
    return this.http
      .get<HttpResponseApi<Afiliado>>(`${this.URL_afiliado}/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._afiliadoSelected$.next(resp.data!);
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  create(form: Afiliado) {
    return this.http
      .post<HttpResponseApi<Afiliado>>(`${this.URL_afiliado}`, form, {
        headers: this.headers,
      })
      .pipe(
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  updateAfiliado(id: number, afiliado: Afiliado) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_afiliado}/${id}`,
        afiliado,
        { headers: this.headers }
      )
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._afiliadoSelected$.next(resp.data!);
          }
        }),
        map((resp) => {
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
  updateStatus(id: number, afiliado: Afiliado) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_afiliado}/status/${id}`,
        afiliado,
        { headers: this.headers }
      )
      .pipe(
        tap((resp) => {
          if (resp.OK) {
            this._afiliadoSelected$.next(resp.data!);
          }
        }),
        map((resp) => {
          return { msg: resp.msg, OK: resp.OK };
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
}
