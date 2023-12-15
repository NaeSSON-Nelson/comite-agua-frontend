import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Menu, MenuForm } from 'src/app/interfaces/menu.interface';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../../interfaces/http-respones.interface';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  URL_Menus: string = environment.apiURrl + '/menus';
  
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
      .get<HttpResponseApiArray<Menu>>(`${this.URL_Menus}`,{params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menus$.next(resp.data)
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

  findOne(id: number) {
    return this.http
      .get<HttpResponseApi<Menu>>(`${this.URL_Menus}/${id}`)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
  create(form: MenuForm) {
    return this.http
      .post<HttpResponseApi<Menu>>(`${this.URL_Menus}`, form)
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
  update(id: number, form: MenuForm) {
    return this.http
      .patch<HttpResponseApi<Menu>>(`${this.URL_Menus}/${id}`, form)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
  updateStatus(id: number, form: Menu) {
    return this.http
      .patch<HttpResponseApi<Menu>>(`${this.URL_Menus}/status/${id}`, form)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menuSelected$.next(resp.data!)
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
}
