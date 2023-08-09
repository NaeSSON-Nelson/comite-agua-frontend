import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfiliadoForm, Perfil } from 'src/app/interfaces';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { CommonAppService } from 'src/app/common/common-app.service';

@Component({
  selector: 'app-perfil-afiliado-form',
  templateUrl: './perfil-afiliado-form.component.html',
  styles: [
  ]
})
export class PerfilAfiliadoFormComponent {
  perfilActual?: Perfil;
  constructor(
    private fb: FormBuilder,
    private readonly perfilService: PerfilService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonServiceApp:CommonAppService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.perfilService.perfil.subscribe((res) => {
      // console.log(res);
      const {afiliado}=res;
      this.perfilActual=res;
      if(afiliado){
        this.afiliadoForm.setValue({
          estado:afiliado.estado,
          barrio:afiliado.ubicacion?.barrio,
          numeroVivienda:afiliado.ubicacion?.numeroVivienda,
          longitud:afiliado.ubicacion?.longitud,
          latitud:afiliado.ubicacion?.latitud,
        })
      }
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['perfiles']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.perfilService.findOnePerfilAfiliado(id)))
        .subscribe({
          next: (res) => {
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
                  this.router.navigate(['perfiles','perfil-list'])
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
          },
        });
    }
  }
  afiliadoForm:FormGroup= this.fb.group({
    estado          :[,[Validators.required]],
    barrio          :[,[Validators.required]],
    numeroVivienda  :[,[Validators.pattern(patternText),Validators.minLength(3)]],
    longitud        :[,[Validators.pattern(patternText),Validators.minLength(3)]],
    latitud         :[,[Validators.pattern(patternText),Validators.minLength(3)]],
  })
  validForm() {
    this.afiliadoForm.markAllAsTouched();
    if (this.afiliadoForm.invalid) return;
    // console.log(this.clienteForm.value);
    let afiliadoSend: AfiliadoForm = {};
    if (this.perfilActual?.afiliado) {
      const {estado,id,ubicacion} = this.perfilActual.afiliado;
      const afiliadoFormActual:AfiliadoForm={
        estado,
        id,
        barrio:ubicacion?.barrio,
        latitud:ubicacion?.latitud,
        longitud:ubicacion?.longitud,
        numeroVivienda:ubicacion?.numeroVivienda
      }
      for (const [key, value] of Object.entries(this.afiliadoForm.value)) {
        if (value !== afiliadoFormActual[key as keyof AfiliadoForm]) {
          afiliadoSend[key as keyof AfiliadoForm] = value as any;
        }
      }
    } else {
      afiliadoSend = Object.assign({}, this.afiliadoForm.value);
      Object.entries(afiliadoSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete afiliadoSend[key as keyof AfiliadoForm];
      });
    }
    this.registrarFormulario(afiliadoSend);
    // console.log('form enviado',afiliadoSend);
    // const { itemsMenu: dataItems, ...dataSend } = menuSend;
    // this.registrarFormulario({
    //   ...dataSend,
    //   itemsMenu: dataItems?.map((val) => val.id!),
    // });
  }
  registrarFormulario(form: AfiliadoForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.perfilActual?.afiliado
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.perfilActual?.afiliado) {
          this.perfilService.updateAfiliado(this.perfilActual.id!, form).subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Se cambio con exito!',
                detail: `${res.message}`,
                icon: 'pi pi-check',
              });
              this.router.navigate(['perfiles', 'perfil-details'], {
                queryParams: { id: this.perfilActual?.id },
              });
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al modificar el Empleado!!',
                detail: `Detalles del error: ???console`,
                life: 5000,
                icon: 'pi pi-times',
              });
              console.log(err);
            },
            complete: () => {},
          });
        } else
          this.perfilService.create(form).subscribe({
            next: (res) => {
              console.log(res);
              this.messageService.add({
                severity: 'success',
                summary: 'Registro Exitoso!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.router.navigate(['perfiles', 'perfil-details'], {
                queryParams: { id: this.perfilActual?.id },
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
  getAfiliadoBarrioErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getAfiliadoNumeroViviendaErrors(campo: string) {
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
  getAfiliadoLongitudErrors(campo: string) {
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
  getAfiliadoLatitudErrors(campo: string) {
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
  getAfiliadoEstadoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
}
