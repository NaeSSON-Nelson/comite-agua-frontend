import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { HttpResponseApi } from 'src/app/interfaces/http-respones.interface';
import { Medidor } from 'src/app/interfaces/medidor.interface';
import { PATH_EDIT } from 'src/app/interfaces/routes-app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsMedidorService {

  API_URL = environment.apiURrl + '/medidores-agua';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  constructor(private http: HttpClient,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  validate(control: AbstractControl){

    return this.http.get<HttpResponseApi<Medidor>>(`${this.API_URL}/nro-medidor/${control.value}`)
    .pipe(
      map(({ data }) => {
        if (data) {
          const indexEdit=this.router.url.split("/").findIndex(val=>val === PATH_EDIT);
          if (this.router.url.includes(PATH_EDIT)){
            
            if(data.id === Number.parseInt(this.router.url.split("/")[indexEdit+1]))
              return null   
                control.setErrors({exist:true});
              return {exist:true}   
          }else{
            control.setErrors({exist:true});
            return {exist:true}   
          }
        }else{
          return null;
        }
      })
    );
  }
}
