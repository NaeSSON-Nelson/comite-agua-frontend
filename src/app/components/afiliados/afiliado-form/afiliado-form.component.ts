import { Component } from '@angular/core';
import { Afiliado } from '../../../interfaces/afiliado.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfiliadosService } from '../afiliados.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  patternCI,
  patternDateFormat,
  patternSpanishInline,
  patternText,
} from 'src/app/patterns/forms-patterns';
import { AsyncValidationsCiService } from '../Validators/async-validations-ci.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-afiliado-form',
  templateUrl: './afiliado-form.component.html',
  styles: [],
})
export class AfiliadoFormComponent {
  afiliadoActual?: Afiliado;

  constructor(
    private fb: FormBuilder,
    private readonly afiliadoService: AfiliadosService,
    private readonly asyncValidationsCiService: AsyncValidationsCiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private routerAct: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.afiliadoService.afiliado.subscribe(res=>{
      this.afiliadoForm.setValue(res);
      this.afiliadoActual = res;
    })
    if (!this.router.url.includes('id')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ id }) => this.afiliadoService.findOne(id)))
      .subscribe(res => {
        if (res.OK === false) {
          switch (res.statusCode) {
            case 401:
              this.messageService.add({
                severity: 'info',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 3000,
              });
              this.router.navigate(['auth', 'login']);
              break;
            case 403:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate(['forbidden']);
              break;
            case 404:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate(['afiliados'])
              break;
            default:
              console.log(res);
              this.messageService.add({
                severity: 'error',
                summary: 'Error no controlado',
                detail: 'revise la consola',
                life: 5000,
              });
              break;
          }
        }
      });
  }

  afiliadoForm: FormGroup = this.fb.group(
    {
      id: [],
      nombrePrimero: [
        ,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(patternSpanishInline),
        ],
      ],
      nombreSegundo: [
        ,
        [Validators.minLength(3), Validators.pattern(patternSpanishInline)],
      ],
      apellidoPrimero: [
        ,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(patternSpanishInline),
        ],
      ],
      apellidoSegundo: [
        ,
        [Validators.minLength(3), Validators.pattern(patternSpanishInline)],
      ],
      CI: [
        ,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(patternCI),
        ],
      ],
      profesion: [, [Validators.minLength(3), Validators.pattern(patternText)]],
      genero: [, [Validators.required, Validators.pattern(patternText)]],
      barrio: [, [Validators.required, Validators.pattern(patternText)]],
      fechaNacimiento: [, [Validators.required]],
      estado: [, [Validators.required]],
    },
    {
      asyncValidators: [
        this.asyncValidationsCiService.validarCI('CI','id'),
      ],
      updateOn: 'blur',
    }
  );

  validForm() {
    this.afiliadoForm.markAllAsTouched();
    // console.log(this.afiliadoForm.errors);
    if (this.afiliadoForm.invalid) return;
    // console.log(this.clienteForm.value);
    let afiliadoSend: Afiliado = {};
    if (this.afiliadoActual) {
      for (const [key, value] of Object.entries(this.afiliadoForm.value)) {
        if (value !== this.afiliadoActual[key as keyof Afiliado]) {
          afiliadoSend[key as keyof Afiliado] = value as any;
        }
      }
    } else {
      afiliadoSend = Object.assign({}, this.afiliadoForm.value);
      Object.entries(afiliadoSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete afiliadoSend[key as keyof Afiliado];
      });
    }
    this.registrarFormulario(afiliadoSend);
    // console.log(afiliadoSend);
  }
  registrarFormulario(afiliadoForm: Afiliado) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.afiliadoActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.afiliadoActual?.id) {
          this.afiliadoService
            .updateAfiliado(this.afiliadoActual.id, afiliadoForm)
            .subscribe({
              next: (res) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate(['/afiliados','detail'],{queryParams:{id:this.afiliadoActual?.id}});
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: ???console`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(err);
              },
              complete: () => {
                
                this.afiliadoForm.reset();
              },
            });
        } else
          this.afiliadoService.create(afiliadoForm).subscribe({
            next: (res) => {
              console.log(res);
              this.messageService.add({
                severity: 'success',
                summary: 'Registro Exitoso!',
                detail: res.message,
                icon: 'pi pi-check',
              });
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al registrar!!',
                detail: `Detalles del error: console`,
                life: 5000,
                icon: 'pi pi-times',
              });
              console.log(err);
            },
            complete: () => {
              this.afiliadoForm.reset();
              this.router.navigate(['/afiliados']);
            },
          });
      },
    });
  }
  limpiarCampo(campo: string) {
    if (
      !this.afiliadoForm.get(campo)?.pristine &&
      this.afiliadoForm.get(campo)?.value?.length === 0
    ) {
      this.afiliadoForm.get(campo)?.reset();
    }
  }

  generos = [
    { name: 'MASCULINO', value: 'masculino' },
    { name: 'FEMENINO', value: 'femenino' },
  ];
  estados = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
  ];
  barrios = [
    { name: '20 de marzo', value: '20 de marzo' },
    { name: 'San Antonio', value: 'san antonio' },
    { name: 'Mendez Fortaleza', value: 'mendez fortaleza' },
    { name: 'Verde Olivo', value: 'verde olivo' },
    { name: 'Primavera', value: 'primavera' },
  ];
  ///VALIDATORS

  campoValido(nombre: string) {
    return (
      this.afiliadoForm.controls[nombre].errors &&
      this.afiliadoForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.afiliadoForm.controls[nombre].errors &&
      this.afiliadoForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.afiliadoForm.controls[nombre].valid &&
        this.afiliadoForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  //MESSAGES ERRORS TYPE

  getNombrePrimeroErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }

  getNombreSegundoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }
  getPrimerApellidoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }
  getSegundoApellidoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }

  getCiErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    // console.log('errors', errors);
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 6 como minimo';
    } else if (errors?.['ciExist']) {
      return 'La Cedula de Identidad ingresado ya existe';
    }

    return '';
  }

  getFechaNacimientoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El formato debe fecha debe seguri el patron: dd/mm/yyyy';
    }
    return '';
  }
  getProfesionErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño minimo debe ser 3';
    }
    return '';
  }
  getBarrioErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    }
    return '';
  }
  getGeneroErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    }
    return '';
  }
  getEstadoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
}
