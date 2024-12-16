import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TarifaMultaPorRetrasosPagos } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { ConfiguracionesService } from '../../configuraciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-tarifa-multa',
  templateUrl: './registrar-tarifa-multa.component.html',
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
    }`
  ]
})
export class RegistrarTarifaMultaComponent {

  @Input()
  visible:boolean=false;
  @Input()
  tarifaSelected:TarifaMultaPorRetrasosPagos|null=null;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  titleForm:string='Nueva tarifa de multas por retraso de pago de servicio';
  constructor(private configuracionService:ConfiguracionesService,
              private messageService:MessageService,
              private confirmationService:ConfirmationService,
              public commonServiceApp:CommonAppService,
              private fb:FormBuilder,
  ){

  }
  ngOnInit(): void {
    if(this.tarifaSelected){
      const {moneda,monto,mesesDemora,vigencia,tipoMulta,} = this.tarifaSelected;
      this.tarifaForm.setValue({
        moneda,monto,mesesDemora,vigencia:new Date(vigencia),tipoMulta
      })
      this.titleForm='Modificar datos de tarifa de multa';
    }
  }
  tarifaForm:FormGroup = this.fb.group({
    monto:[,[Validators.required,Validators.min(1)]],
    moneda:[,[Validators.required]],
    mesesDemora:[,[Validators.required,Validators.min(1)]],
    tipoMulta:[,[Validators.required]],
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
      message: `¿Está seguro de ${this.tarifaSelected?' modificar los datos de esta tarifa':'registrar nueva tarifa de multa por retraso de pago de servicio'}?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept:()=>{
        if(this.tarifaSelected){
          this.configuracionService.updateMultaPorRetrasoPago(this.tarifaSelected.id,form).subscribe(res=>{
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
          this.configuracionService.registrarNuevaTarifaMultasPorRetrasoPago(form).subscribe(res=>{
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

  getMontoErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
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
  getMesesDemoraErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;
  }
  getTipoMultaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;  }
  getVigenciaErrors(campo:string){
    const errors = this.tarifaForm.get(campo)?.errors
    if(errors?.['required']){
      return 'El campo es requerido'
    }
    return ``;
  }
  
}
