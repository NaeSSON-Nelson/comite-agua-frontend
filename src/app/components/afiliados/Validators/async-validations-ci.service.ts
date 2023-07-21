import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, delay, map, of } from 'rxjs';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import {
  HttpResponseApi,
  HttpResponseApiArray,
} from 'src/app/interfaces/http-respones.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AsyncValidationsCiService implements AsyncValidator {
  API_URL = environment.apiURrl + '/afiliados';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  constructor(private http: HttpClient) {}
  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    throw new Error('Method not implemented.');
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }
  validarCI(campoCi: string, campoId: string) {
    return (
      formGroup: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> => {
      const ci = formGroup.get(campoCi)?.value;
      const id = formGroup.get(campoId)?.value;
      // console.log(ci,id);
      return this.http
        .get<HttpResponseApi<Afiliado>>(`${this.API_URL}/ci?q=${ci}`, {
          headers: this.headers,
        })
        .pipe(
          delay(100),
          map(({ data }) => {
            // return data.length === 0 ? null : { ciExist: true,actual:{} };
            // console.log(id);
            // console.log(data,id);
            if (data) {
              if (id) {
                if (data.id !== id) {
                  formGroup.get(campoCi)?.setErrors({ ciExist: true });
                  return { ciExiste: true };
                }
                return null;
              } else {
                formGroup.get(campoCi)?.setErrors({ ciExist: true });
                return { ciExiste: true };
              }
            }
            return null;
          })
        );
    };
  }
}
