import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, delay, map } from 'rxjs';
import { HttpResponseApi } from 'src/app/interfaces/http-respones.interface';
import { Medidor } from 'src/app/interfaces/medidor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsMedidorService {

  API_URL = environment.apiURrl + '/medidores';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  constructor(private http: HttpClient) {}
  validarNroMedidor(campoMedidor: string, campoId: string) {
    return (
      formGroup: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> => {
      const medidor = formGroup.get(campoMedidor)?.value;
      const id = formGroup.get(campoId)?.value;
      // console.log(ci,id);
      return this.http
        .get<HttpResponseApi<Medidor>>(`${this.API_URL}/nro-medidor/${medidor}`, {
          headers: this.headers,
        })
        .pipe(
          delay(100),
          map(({ data }) => {
            // return data.length === 0 ? null : { ciExist: true,actual:{} };
            // console.log(id);
            // console.log(data,id);
            if (data) {
              // console.log(data);
              if (id) {
                if (data.id !== id) {
                  formGroup.get(campoMedidor)?.setErrors({ exist: true });
                  return { exist: true };
                }
                return null;
              } else {
                formGroup.get(campoMedidor)?.setErrors({ exist: true });
                return { exist: true };
              }
            }
            return null;
          })
        );
    };
  }
}
