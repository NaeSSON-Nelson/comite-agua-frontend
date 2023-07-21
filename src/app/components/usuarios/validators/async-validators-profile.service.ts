import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, delay, map,of } from 'rxjs';
import { HttpResponseApi } from 'src/app/interfaces/http-respones.interface';
import { Perfil } from 'src/app/interfaces/usuario.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsProfileService {

  API_URL = environment.apiURrl + '/usuarios';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  constructor(private http: HttpClient) {}

  validarEmail(campoValidate: string, campoId: string) {
    return (
      formGroup: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> => {
      const email = formGroup.get(campoValidate)?.value;
      const id = formGroup.get(campoId)?.value;
      if(email===null || email ==='') return of(null);
      return this.http
        .get<HttpResponseApi<Perfil>>(`${this.API_URL}/email/${email}`, {
          headers: this.headers,
        })
        .pipe(
          delay(100),
          map(({ data }) => {
            if (data) {
              if (id) {
                if (data.id !== id) {
                  formGroup.get(campoValidate)?.setErrors({ exist: true });
                  return { exist: true };
                }
                return null;
              } else {
                formGroup.get(campoValidate)?.setErrors({ exist: true });
                return { exist: true };
              }
            }
            return null;
          })
        );
    };
  }

  validarPostalCode(campoValidate: string, campoId: string) {
    return (
      formGroup: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> => {
      const postal = formGroup.get(campoValidate)?.value;
      const id = formGroup.get(campoId)?.value;
      if(postal===null || postal ==='') return of(null);
      return this.http
        .get<HttpResponseApi<Perfil>>(`${this.API_URL}/code/${postal}`, {
          headers: this.headers,
        })
        .pipe(
          delay(100),
          map(({ data }) => {
            
            if (data) {
              if (id) {
                if (data.id !== id) {
                  formGroup.get(campoValidate)?.setErrors({ exist: true });
                  return { exist: true };
                }
                return null;
              } else {
                formGroup.get(campoValidate)?.setErrors({ exist: true });
                return { exist: true };
              }
            }
            return null;
          })
        );
    };
  }
}
