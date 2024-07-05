import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemMenu, Menu } from '../interfaces/menu.interface';
import { DataResult, HttpResponseApiArray } from '../interfaces/http-respones.interface';
import { PaginatorFind } from '../interfaces/Paginator.interface';
import { Role } from '../interfaces/role.interface';
import { Afiliado } from '../interfaces/afiliado.interface';
import { Medidor } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HelpersTablesService {


  URL_itemsMenus: string = environment.apiURrl + '/items-menu';
  URL_menus: string = environment.apiURrl + '/menus';
  URL_roles: string = environment.apiURrl + '/roles';
  URL_afiliados: string = environment.apiURrl + '/afiliados';
  URL_medidores: string = environment.apiURrl + '/medidores-agua';

  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  private _itemsMenus$:Subject<DataResult<ItemMenu>>;
  private _menus$:Subject<DataResult<Menu>>;
  private _roles$:Subject<DataResult<Role>>;
  private _afiliadosSinUsuario$:Subject<DataResult<Afiliado>>;
  private _medidores$:Subject<DataResult<Medidor>>;
  constructor(private http: HttpClient) {
    this._itemsMenus$= new Subject<DataResult<ItemMenu>>();
    this._menus$= new Subject<DataResult<Menu>>();
    this._roles$= new Subject<DataResult<Role>>();
    this._afiliadosSinUsuario$ = new Subject<DataResult<Afiliado>>();
    this._medidores$ = new Subject<DataResult<Medidor>>();
  }
  get itemsMenus(){
    return this._itemsMenus$.asObservable();
  }
  get menus(){
    return this._menus$.asObservable();
  }
  get roles(){
    return this._roles$.asObservable();
  }
  get afiliadosSinUsuario(){
    return this._afiliadosSinUsuario$.asObservable();
  }
  get medidores(){
    return this._medidores$.asObservable();
  }
  findAllItemsMenus(paginator:PaginatorFind) {
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
          return {OK: resp.OK, message: resp.message,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, message: 'Error recibido' });
        })
      );
  }
  findAllMenus(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Menu>>(`${this.URL_menus}`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._menus$.next(resp.data)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, message: resp.message,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, message: 'Error recibido' });
        })
      );
  }

  findAllRoles(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Role>>(`${this.URL_roles}`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            // console.log(resp.data);
            this._roles$.next(resp.data)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, message: resp.message,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, message: 'Error recibido' });
        })
      );
  }
  findAllAfiliadosSinUsuario(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Afiliado>>(`${this.URL_afiliados}/usuarios`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._afiliadosSinUsuario$.next(resp.data)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, message: resp.message,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, message: 'Error recibido' });
        })
      );
  }
  findAllMedidoresWithoutAsociacion(paginator:PaginatorFind){
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Medidor>>(`${this.URL_medidores}/asociacion`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          
          if(resp.OK){
            this._medidores$.next(resp.data)
          }
        }),
        map((resp) => {
          return {OK: resp.OK, message: resp.message,};
        }),
        catchError((err) => {
          console.log(err);
          return of({ OK: false, message: 'Error recibido' });
        })
      );
  }
}
