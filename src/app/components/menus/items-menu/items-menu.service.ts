import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
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
      .get<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}/${id}`,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._itemMenuSelected$.next(resp.data!)
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
  create(form: ItemMenu) {
    return this.http
      .post<HttpResponseApi<ItemMenu>>(`${this.URL_itemsMenus}`, form,{headers:this.headers})
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
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
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
          return {OK: resp.OK, msg: resp.msg,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, msg: 'Error recibido' });
        })
      );
  }
}
