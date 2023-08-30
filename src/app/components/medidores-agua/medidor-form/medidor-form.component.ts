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
import { Perfil } from 'src/app/interfaces';
import { CommonAppService } from 'src/app/common/common-app.service';

@Component({
  selector: 'app-medidor-form',
  templateUrl: './medidor-form.component.html',
  styles: [
  ]
})
export class MedidorFormComponent {
  perfilActual?: Perfil;
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
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.medidoresService.afiliadoWithMedidores.subscribe((res) => {
      // console.log(res);
      // const {medidores} =res;
      // this.medidorActual=res;
      // this.medidorForm.setValue({...dataMedidorForm,afiliado:{id:afiliado!.id}});
      this.perfilActual=res;
      console.log(res);
      this.medidorForm.get('afiliado')?.get('id')?.setValue(this.perfilActual?.afiliado!.id)
      this.routerAct.queryParams
                    .subscribe(params=>{
                      // console.log('parametros',params);
                      if(params?.['idMedidor']){
                        // console.log(params?.['idMedidor']);
                        if(Number.isInteger(Number.parseInt(params?.['idMedidor'])))
                        // console.log(params?.['idMedidor']);
                        this.medidorActual = this.perfilActual?.afiliado?.medidores?.find(val=>val.id===Number.parseInt(params?.['idMedidor']))
                        // console.log(this.medidorActual);
                        const {afiliado,ultimaLectura,created_at,isActive,ubicacion,updated_at,...dataMedidor} = this.medidorActual!;
                        console.log(this.perfilActual);
                        this.medidorForm.setValue({...dataMedidor,afiliado:{id:this.perfilActual!.afiliado!.id},barrio:ubicacion?.barrio});
                      }
                    })
    });
    if (!this.router.url.includes('idPerfil')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ idPerfil}) => this.medidoresService.findOne(idPerfil)))
      .subscribe((res) => {
        // console.log(res);
        if (!res.OK) {
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
              this.router.navigate(['medidores-agua'])
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
  medidorForm: FormGroup = this.fb.group(
    {
      id: [],
      nroMedidor:[,[Validators.required,Validators.pattern(patternCI),Validators.minLength(4)]],
      fechaInstalacion:[,[Validators.required]],
      lecturaInicial:[0,[Validators.required,Validators.min(0)]],
      barrio:[,[Validators.required,Validators.minLength(3),Validators.pattern(patternText)]],
      estado:[,[Validators.min(0)]],
      marca:[,[Validators.required,Validators.pattern(patternText),Validators.minLength(1)]],
      afiliado: this.fb.group({
        id:[,[Validators.required,Validators.min(0)]]
      })
    },
    {
      updateOn: 'blur',
      asyncValidators: [this.asyncValidators.validarNroMedidor('nroMedidor', 'id')],
    }
  );
  validForm() {
    this.medidorForm.markAllAsTouched();
    console.log(this.medidorForm);
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
    this.registrarFormulario(medidorSend);
    // console.log(medidorSend);
    // const { itemsMenu: dataItems, ...dataSend } = menuSend;
    // this.registrarFormulario({
    //   ...dataSend,
    //   itemsMenu: dataItems?.map((val) => val.id!),
    // });
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
              this.messageService.add({
                severity: 'info',
                summary: 'Se cambio con exito!',
                detail: `${res.message}`,
                icon: 'pi pi-check',
              });
              this.router.navigate(['medidores-agua', 'medidor-agua-details'], {
                queryParams: { id: this.perfilActual?.id },
              });
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
            complete: () => {},
          });
        } else
          this.medidoresService.create(form).subscribe({
            next: (res) => {
              console.log(res);
              this.messageService.add({
                severity: 'success',
                summary: 'Registro Exitoso!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.router.navigate(['medidores-agua','medidor-agua-details'],
              {queryParams:{id:this.perfilActual?.id}});
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al registrar !!',
                detail: `Detalles del error: console`,
                life: 5000,
                icon: 'pi pi-times',
              });
              console.log(err);
            },
            complete: () => {
              this.medidorForm.reset();
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
      return 'El Numero de medidor ya existe'
    }
    return '';
  }
  getFechaInstalacionErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'La fecha debe seguir el orden: dd/mm/yyyy';
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
    if (errors?.['min']) {
      return 'El minimo es 0';
    }
    return '';
  }
  getBarrioErrors(campo: string) {
    const errors = this.medidorForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }else if(errors?.['minlength']){
      return 'El valor minimo es 3'
    }else if(errors?.['pattern']){
      return 'caracteres no validos'
    }
    return '';
  }
}
