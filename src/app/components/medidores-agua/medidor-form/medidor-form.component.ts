import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medidor, MedidorForm } from 'src/app/interfaces/medidor.interface';
import { MedidoresAguaService } from '../medidores-agua.service';
import { AsyncValidatorsMedidorService } from '../Validators/async-validators-medidor.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternCI, patternDateFormat, patternText } from 'src/app/patterns/forms-patterns';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { Estado, Perfil } from 'src/app/interfaces';
import { CommonAppService } from 'src/app/common/common-app.service';
import * as L from 'leaflet';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_MEDIDORES, PATH_MODULE_DETAILS } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-medidor-form',
  templateUrl: './medidor-form.component.html',
  styles: [
  ]
})
export class MedidorFormComponent {
  medidorActual?:Medidor;
  constructor(
    private fb: FormBuilder,
    private readonly medidoresService: MedidoresAguaService,
    private asyncValidators: AsyncValidatorsMedidorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonAppService:CommonAppService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.medidoresService.medidor.subscribe((res) => {
      // console.log(res);
      this.medidorActual=res;
      this.medidorForm.removeControl('estado');
      this.medidorForm.setValue({
        nroMedidor:res.nroMedidor,
        lecturaInicial:res.lecturaInicial,
        // estado:res.estado,
        medicion:res.medicion,
        marca:res.marca,
      })
    });
    if (this.routerAct.snapshot.params['id'] && this.routerAct.snapshot.routeConfig?.path?.includes(PATH_EDIT)){
      this.medidoresService.findOneMedidor(this.routerAct.snapshot.params['id']).
      subscribe((res) => {
        if (res.OK === false) {
          switch (res.statusCode) {
            case 401:
              this.messageService.add({
                severity: 'info',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 3000,
              });
              this.router.navigate([PATH_AUTH]);
              break;
            case 403:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate([PATH_FORBBIDEN]);
              break;
            case 404:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate([PATH_MEDIDORES])
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
      })
  }
  }
  medidorForm: FormGroup = this.fb.group(
    {
      nroMedidor:        [,[Validators.required,Validators.pattern(patternCI),Validators.minLength(4),],[this.asyncValidators]],
      lecturaInicial:    [0,[Validators.required,Validators.min(0)]],
      estado:            [Estado.ACTIVO],
      medicion:          [,Validators.required],
      marca:             [,[Validators.required,Validators.pattern(patternText),Validators.minLength(1)]],

    },
    {
      updateOn: 'blur',
    }
  );
  tiposFun=[
    {name:'SI',value:'SI',},
    {name:'NO',value:'NO',},
  ]
  validForm() {
    this.medidorForm.markAllAsTouched();
    // console.log(this.medidorForm);
    if (this.medidorForm.invalid) return;
    // console.log(this.clienteForm.value);
    let medidorSend: MedidorForm = {};
    if (this.medidorActual) {
      for (const [key, value] of Object.entries(this.medidorForm.value)) {
        if (value !== this.medidorActual[key as keyof Medidor]) {
          medidorSend[key as keyof MedidorForm] = value as any;
        }
      }
    } else {
      medidorSend = Object.assign({}, this.medidorForm.value);
      Object.entries(medidorSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete medidorSend[key as keyof MedidorForm];
      });
    }
    // console.log('MEDIDOR SEND',medidorSend);
    this.registrarFormulario(medidorSend);
  }
  registrarFormulario(form: Medidor) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.medidorActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.medidorActual?.id) {
          this.medidoresService.update(this.medidorActual.id, form).subscribe({
            next: (res) => {
              if(res.OK){

                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_MEDIDORES, PATH_MODULE_DETAILS,this.medidorActual?.id]);
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: ???console ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res);
              }
            },
          });
        } else
          this.medidoresService.create(form).subscribe({
            next: (res) => {
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_MEDIDORES],
                // {queryParams:{id:this.perfilActual?.id}}
              );
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al registrar !!',
                  detail: `Detalles del error: console ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res);
              }
            },
          });
      },
    });
  }
  limpiarCampo(campo: string) {
    if (
      !this.medidorForm.get(campo)?.pristine &&
      this.medidorForm.get(campo)?.value?.length === 0
    ) {
      this.medidorForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.medidorForm.controls[nombre].errors &&
      this.medidorForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.medidorForm.controls[nombre].errors &&
      this.medidorForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.medidorForm.controls[nombre].valid &&
        this.medidorForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  coordenadas($event:any){
    this.medidorForm.get('latitud')?.setValue($event.lat);
    this.medidorForm.get('longitud')?.setValue($event.lng);
  }
  get coordenadasLatLng(){
    return new L.LatLng(this.medidorForm.get('latitud')?.value ||-21.4734,this.medidorForm.get('longitud')?.value ||-64.8026);
  }

  
  //MESSAGES ERRORS TYPE

  getNroMedidorErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 4 como minimo';
    } else if(errors?.['exist']){
      return `El numero de medidor esta registrado`
    }
    return '';
  }
  getLecturaInicialErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['min']) {
      return 'La Lectura minima es 0';
    } 
    return '';
  }
  getMarcaErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 1 como minimo';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;
    
    return '';
  }
  getMedicionErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;
    if(errors?.['required']) 
      return 'El campo es requerido';
    return '';
  }
  get formValid(){
    return this.medidorForm.valid && this.medidorForm.touched && !this.medidorForm.pristine
  }
}
