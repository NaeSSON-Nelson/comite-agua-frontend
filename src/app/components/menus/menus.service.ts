import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Menu, MenuForm } from 'src/app/interfaces/menu.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  URL_Menus: string = environment.apiURrl + '/menus';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _menus$:Subject<DataResult<Menu>>;
  private _menuSelected$:Subject<Menu>;
  constructor(private http: HttpClient) {
    this._menus$= new Subject<DataResult<Menu>>();
    this._menuSelected$ = new Subject<Menu>();
  }
  get menus(){
    return this._menus$.asObservable();
  }
  get menu(){
    return this._menuSelected$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Menu>>(`${this.URL_Menus}`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menus$.next(resp.data)
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
      .get<HttpResponseApi<Menu>>(`${this.URL_Menus}/${id}`,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
  create(form: MenuForm) {
    return this.http
      .post<HttpResponseApi<Menu>>(`${this.URL_Menus}`, form,{headers:this.headers})
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
  update(id: number, form: MenuForm) {
    return this.http
      .patch<HttpResponseApi<Menu>>(`${this.URL_Menus}/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
  updateStatus(id: number, form: Menu) {
    return this.http
      .patch<HttpResponseApi<Menu>>(`${this.URL_Menus}/status/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
