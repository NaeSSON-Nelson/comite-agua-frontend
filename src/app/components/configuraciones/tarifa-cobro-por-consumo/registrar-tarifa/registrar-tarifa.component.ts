import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfiguracionesService } from '../../configuraciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonAppService } from 'src/app/common/common-app.service';
import { TarifaPorConsumoAgua } from 'src/app/interfaces/opciones-confuguraciones.interface';

@Component({
  selector: 'app-registrar-tarifa',
  templateUrl: './registrar-tarifa.component.html',
  styles: [`
    .form-container{
      min-height:600px
    }
    /* Asegura que el calendario se muestre por encima del modal */
    .p-calendar-overlay {
      z-index: 9999 !important;
      position: fixed !important;
    }

    ::ng-deep .p-datepicker table td {
     padding: 0.3rem !important;
    }

    ::ng-deep .p-datepicker table td > span {
      width: 1.9rem;
      height: 1.9rem;
    }

    ::ng-deep .p-datepicker table {
      font-size: 12pt;
      margin: -0.150rem 0;
    }

    ::ng-deep .p-datepicker .p-datepicker-header {
      padding: 0.25rem;
    }
    `
  ]
})
export class RegistrarTarifaComponent {
  @Input()
  visible:boolean=false;
  @Input()
  tarifaSelected:TarifaPorConsumoAgua|null=null;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  titleForm:string='Nueva tarifa de cobro del consumo de agua potable';
  constructor(private configuracionService:ConfiguracionesService,
              private messageService:MessageService,
              private confirmationService:ConfirmationService,
              public commonServiceApp:CommonAppService,
              private fb:FormBuilder,
  ){

  }
  ngOnInit(): void {
    if(this.tarifaSelected){
      const {moneda,lecturaMinima,tarifaAdicional,vigencia,diaLimitePago,tarifaMinima,} = this.tarifaSelected;
      this.tarifaForm.setValue({
        moneda,lecturaMinima,tarifaAdicional,diaLimitePago,vigencia:new Date(vigencia),tarifaMinima
      })
      this.titleForm='Modificar datos de tarifa';
    }
  }
  tarifaForm:FormGroup = this.fb.group({
    tarifaMinima:[,[Validators.required,Validators.min(1)]],
    lecturaMinima:[,[Validators.required,Validators.min(1)]],
    tarifaAdicional:[,[Validators.required,Validators.min(1)]],
    diaLimitePago:[,[Validators.required,Validators.min(20),Validators.max(27)]],
    moneda:[,[Validators.required]],
    vigencia:[,[Validators.required]],
  });

  validForm(){
    this.tarifaForm.markAllAsTouched();
    console.log('form',this.tarifaForm);
    console.log('form value',this.tarifaForm.value);
    if(this.tarifaForm.invalid) return;
    this.registrar(this.tarifaForm.value);
  }
  registrar(form:any){
    this.confirmationService.confirm({
      message: `¿Está seguro de ${this.tarifaSelected?' modificar los datos de esta tarifa':'registrar esta nueva tarifa de cobro por consumo'}?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept:()=>{
        if(this.tarifaSelected){
          this.configuracionService.updateTarifasCobroPorConsumo(this.tarifaSelected.id,form).subscribe(res=>{
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Modificación de datos correctamente!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.eventVisible.emit(false);
            }
          })
        }else{
          this.configuracionService.registrarNuevaTarifaCobroPorConsumo(form).subscribe(res=>{
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Registro de nueva tarifa exito!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.eventVisible.emit(false);
            }
          })
        }
      }
    })
  }
  campoValido(nombre: string) {
    return (
      this.tarifaForm.controls[nombre].errors &&
      this.tarifaForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.tarifaForm.controls[nombre].errors &&
      this.tarifaForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }

  getTarifaMinimaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;
  }
  getLecturaMinimaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;
  }
  getTarifaAdicionalErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;
  }
  getDiaLimitePagoErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El dia límite minimo es el ${errors?.['min'].min}`
    }else if(errors?.['max']){
      return `El dia límite maximo es el ${errors?.['max'].max}`
    }
    return ``;
  }
  getMonedaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors
    if(errors?.['required']){
      return 'El campo es requerido'
    }
    return ``;
  }
  getVigenciaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors
    if(errors?.['required']){
      return 'El campo es requerido'
    }
    return ``;
  }
  
}
