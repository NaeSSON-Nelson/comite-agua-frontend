import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Medidor } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedidoresAguaService {

  URL_medidores: string = environment.apiURrl + '/medidores';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _AfiliadosWidthMedidores$:Subject<DataResult<Afiliado>>;
  private _afiliadoWithMedidores$:Subject<Afiliado>;
  private _medidor$:Subject<Medidor>
  constructor(private http: HttpClient) {
    this._AfiliadosWidthMedidores$= new Subject<DataResult<Afiliado>>();
    this._afiliadoWithMedidores$ = new Subject<Afiliado>();
    this._medidor$ = new Subject<Medidor>();
  }

  get allAfiliados(){
    return this._AfiliadosWidthMedidores$.asObservable();
  }
  get afiliadoWithMedidores(){
    return this._afiliadoWithMedidores$.asObservable();
  }
  get medidor(){
    return this._medidor$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
  //  console.log(paginator);
   let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Afiliado>>(`${this.URL_medidores}/afiliados`, {
        headers:this.headers,
        params:{...dataPaginator}
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            resp.data
            this._AfiliadosWidthMedidores$.next(resp.data)
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
      .get<HttpResponseApi<Afiliado>>(`${this.URL_medidores}/afiliado/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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
  findOneMedidor(idMedidor:number){
    return this.http
    .get<HttpResponseApi<Medidor>>(`${this.URL_medidores}/${idMedidor}`, {
      headers: this.headers,
    })
    .pipe(
      tap((resp)=>{
        if(resp.OK){
          this._medidor$.next(resp.data!)
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
  create(form: Medidor) {
    return this.http
      .post<HttpResponseApi<Medidor>>(`${this.URL_medidores}`, form, {
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
  update(id: number, data: Medidor) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_medidores}/${id}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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


  updateStatus(id: number, data: Medidor) {
    return this.http
      .patch<HttpResponseApi<Afiliado>>(
        `${this.URL_medidores}/status/${id}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadoWithMedidores$.next(resp.data!)
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
}
