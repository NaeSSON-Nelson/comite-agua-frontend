import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray,ResponseResult } from 'src/app/interfaces/http-respones.interface';
import { ItemMenu } from 'src/app/interfaces/menu.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsMenuService {
  URL_itemsMenus: string = environment.apiURrl + '/items-menu';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _itemsMenus$:Subject<DataResult<ItemMenu>>;
  private _itemMenuSelected$:Subject<ItemMenu>;
  constructor(private http: HttpClient) {
    this._itemsMenus$= new Subject<DataResult<ItemMenu>>();
    this._itemMenuSelected$ = new Subject<ItemMenu>();
  }
  get itemsMenus(){
    return this._itemsMenus$.asObservable();
  }
  get itemMenu(){
    return this._itemMenuSelected$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<ItemMenu>>(`${this.URL_itemsMenus}`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._itemsMenus$.next(resp.data)
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
      .get<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}/${id}`,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._itemMenuSelected$.next(resp.data!)
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
  create(form: ItemMenu) {
    return this.http
      .post<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}`, form,{headers:this.headers})
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
  update(id: number, form: ItemMenu) {
    return this.http
      .patch<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._itemMenuSelected$.next(resp.data!)
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
  updateStatus(id: number, form: ItemMenu) {
    return this.http
      .patch<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}/status/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._itemMenuSelected$.next(resp.data!)
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
