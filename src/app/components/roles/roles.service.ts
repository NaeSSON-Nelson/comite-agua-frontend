import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Role, RoleForm } from 'src/app/interfaces/role.interface';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../../interfaces/http-respones.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  
  URL_Roles: string = environment.apiURrl + '/roles';
  private _roles$:Subject<DataResult<Role>>;
  private _roleSelected$:Subject<Role>;
  constructor(private http: HttpClient) {
    this._roles$= new Subject<DataResult<Role>>();
    this._roleSelected$ = new Subject<Role>();
  }
  get roles(){
    return this._roles$.asObservable();
  }
  get role(){
    return this._roleSelected$.asObservable();
  }
  findAll(paginator:PaginatorFind) {
    let {size,...dataPaginator } = paginator;
    return this.http
      .get<HttpResponseApiArray<Role>>(`${this.URL_Roles}`,{params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roles$.next(resp.data)
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
      .get<HttpResponseApi<Role>>(`${this.URL_Roles}/${id}`)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
  create(form: RoleForm) {
    return this.http
      .post<HttpResponseApi<Role>>(`${this.URL_Roles}`, form)
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
  update(id: number, form: RoleForm) {
    return this.http
      .patch<HttpResponseApi<Role>>(`${this.URL_Roles}/${id}`, form)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
  updateStatus(id: number, form: Role) {
    return this.http
      .patch<HttpResponseApi<Role>>(`${this.URL_Roles}/status/${id}`, form)
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
