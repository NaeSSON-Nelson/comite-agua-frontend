import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, delay, map } from 'rxjs';
import { HttpResponseApi } from 'src/app/interfaces/http-respones.interface';
import { Menu } from 'src/app/interfaces/menu.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorLinkService {

  API_URL = environment.apiURrl + '/menus';
  private headers = new HttpHeaders().set(
    'authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );
  constructor(private http: HttpClient) {}

  validarLink(campo: string, campoId: string) {
    return (
      formGroup: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> => {
      const campoR = formGroup.get(campo)?.value;
      const id = formGroup.get(campoId)?.value;
      // console.log(campoR,id);
      return this.http
        .get<HttpResponseApi<Menu>>(`${this.API_URL}/link/${campoR}`, {
          headers: this.headers,
        })
        .pipe(
          delay(100),
          map(({ data }) => {
            // return data.length === 0 ? null : { ciExist: true,actual:{} };
            // console.log(id);
            // console.log(data,id);
            // console.log('1',data);
            if (data) {
              // console.log('2',data);
              if (id) {
                // console.log('3.1',data);
                if (data.id !== id) {
                  formGroup.get(campo)?.setErrors({ exist: true });
                  return { exist: true };
                }
                return null;
              } else {
                // console.log('3.2',data);
                formGroup.get(campo)?.setErrors({ exist: true });
                return { exist: true };
              }
            }
            return null;
          })
        );
    };
  }
}
