import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BeneficiarioDescuentos } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { ConfiguracionesService } from '../../configuraciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-nuevo-beneficiario',
  templateUrl: './registrar-nuevo-beneficiario.component.html',
  styles: [
  ]
})
export class RegistrarNuevoBeneficiarioComponent {

  @Input()
  visible:boolean=false;
  @Input()
  beneficiarioSelected:BeneficiarioDescuentos|null=null;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  titleForm:string='Registro de un nuevo beneficiario';
  constructor(private configuracionService:ConfiguracionesService,
              private messageService:MessageService,
              private confirmationService:ConfirmationService,
              public commonServiceApp:CommonAppService,
              private fb:FormBuilder,
  ){

  }
  ngOnInit(): void {
    if(this.beneficiarioSelected){
      const {descuento,detalles,tipoBeneficiario} = this.beneficiarioSelected;
      this.beneficiarioForm.setValue({
      descuento,detalles,tipoBeneficiario
      })
      this.titleForm='Modificar datos del beneficiario';
    }
  }
  beneficiarioForm:FormGroup = this.fb.group({
    tipoBeneficiario:[,[Validators.required,Validators.minLength(1)]],
    descuento:[,[Validators.required,Validators.min(1)]],
    detalles:[,[Validators.minLength(10)]],
  });
  
  validForm(){
    this.beneficiarioForm.markAllAsTouched();
    console.log('form',this.beneficiarioForm);
    console.log('form value',this.beneficiarioForm.value);
    if(this.beneficiarioForm.invalid) return;
    this.registrar(this.beneficiarioForm.value);
  }
  registrar(form:any){
    this.confirmationService.confirm({
      message: `¿Está seguro de ${this.beneficiarioSelected?' modificar los datos del beneficiario':'registrar el nuevo beneficiario'}?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept:()=>{
        if(this.beneficiarioSelected){
          this.configuracionService.updateBeneficario(this.beneficiarioSelected.id,form).subscribe(res=>{
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
          this.configuracionService.registrarNuevoBeneficario(form).subscribe(res=>{
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Registro de nuevo beneficiario exitoso!',
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
      this.beneficiarioForm.controls[nombre].errors &&
      this.beneficiarioForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.beneficiarioForm.controls[nombre].errors &&
      this.beneficiarioForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }

  getDescuentoErrors(campo:string){
    const errors = this.beneficiarioForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['min']){
      return `El mínimo de registro es de ${errors?.['min'].min}`
    }
    return ``;
  }
  getTipoBeneficiarioErrors(campo:string){
    const errors = this.beneficiarioForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido'
    }else if(errors?.['minlength']){
      return `El mínimo de registro es de ${errors?.['minlength'].requiredLength}`
    }
    return ``;
  }
  getDetallesErrors(campo:string){
    const errors = this.beneficiarioForm.get(campo)?.errors;

    if(errors?.['minlength']){
      return `Debe haber minimo ${errors?.['minlength'].requiredLength}`
    }
    return ``;
  }
}
