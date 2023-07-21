import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, of, tap } from 'rxjs';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { DataResult, HttpResponseApi, HttpResponseApiArray } from 'src/app/interfaces/http-respones.interface';
import { Role, RoleForm } from 'src/app/interfaces/role.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  
  URL_Roles: string = environment.apiURrl + '/roles';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
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
      .get<HttpResponseApiArray<Role>>(`${this.URL_Roles}`,{headers:this.headers,params:{...dataPaginator}})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roles$.next(resp.data)
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
      .get<HttpResponseApi<Role>>(`${this.URL_Roles}/${id}`,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
  create(form: RoleForm) {
    return this.http
      .post<HttpResponseApi<Role>>(`${this.URL_Roles}`, form,{headers:this.headers})
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
  update(id: number, form: RoleForm) {
    return this.http
      .patch<HttpResponseApi<Role>>(`${this.URL_Roles}/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
  updateStatus(id: number, form: Role) {
    return this.http
      .patch<HttpResponseApi<Role>>(`${this.URL_Roles}/status/${id}`, form,{headers:this.headers})
      .pipe(
        tap((resp)=>{
          if(resp.OK){
            this._roleSelected$.next(resp.data!)
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
