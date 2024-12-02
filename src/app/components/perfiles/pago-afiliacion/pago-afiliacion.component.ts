import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetodoPago, Monedas } from 'src/app/interfaces/atributes.enum';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Afiliado, Perfil } from 'src/app/interfaces';
import { CommonAppService } from 'src/app/common/common-app.service';
import { amountMatchValidator, MonedaMatchValidator } from './../validators/monto-validator.service';

@Component({
  selector: 'app-pago-afiliacion',
  templateUrl: './pago-afiliacion.component.html',
  styles: [
  ]
})
export class PagoAfiliacionComponent {

  @Input()
  visible:boolean=false;
  @Input()
  perfil!:Perfil;

  afiliado!:Afiliado;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private perfilService:PerfilService,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    public commonAppService:CommonAppService,
    private fb: FormBuilder,
  ){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.obtenerPago();
    this.formPago.get('metodoPago')?.valueChanges.subscribe(tipo=>{
      this.updateFormPagoMetodoPago(tipo);
    })
  }
  obtenerPago(){
    if(this.perfil.id!>0){
      this.perfilService.obtenerDatosPago(this.perfil.id!).subscribe(res=>{
        console.log(res);
        if(res.OK){
          this.afiliado=res.data!;
          // this.formPago.get('montoRecibido')?.addValidators(amountMatchValidator(this.afiliado.monto!));
          this.formPago.get('montoRecibido')?.setValidators([Validators.required,Validators.min(0),amountMatchValidator(this.afiliado.monto!)]);
          this.formPago.get('monedaRecibido')?.setValidators([Validators.required,MonedaMatchValidator(this.afiliado.moneda!)]);
          // this.formPago.get('monedaRecibido')?.addValidators(MonedaMatchValidator(this.afiliado.moneda!));
          this.formPago.get('perfilId')?.setValue(this.perfil.id!);
        }
      });
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Id perfil invalido',
        life: 5000,
        icon: 'pi pi-times',
      });
    }
  }
  formPago:FormGroup = this.fb.group({
    perfilId:[,Validators.required],
    montoRecibido:[,[Validators.required,Validators.min(0)]],
    monedaRecibido:[,Validators.required],
    metodoPago:[,Validators.required],
  });
  updateFormPagoMetodoPago(tipo:MetodoPago){
    // console.log('actualizando form tipo metodo pago');
    const campos = ['nroRecibo', 'entidad', 'remitente','nroCuenta'];
    campos.forEach(field=>{
      if(this.formPago.contains(field))
        this.formPago.removeControl(field);
    });
    switch (tipo){
      case MetodoPago.deposito:
        this.formPago.addControl('nroRecibo',this.fb.control(null,[Validators.required,Validators.minLength(3),Validators.maxLength(50)]))
        this.formPago.addControl('entidad',this.fb.control(null,[Validators.required,Validators.minLength(10),Validators.maxLength(50)]))
        this.formPago.addControl('remitente',this.fb.control(null,[Validators.required,Validators.minLength(5),Validators.maxLength(90)]))
        this.formPago.addControl('nroCuenta',this.fb.control(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]))
        
        break;
        case MetodoPago.presencial:
          
          
          break;
          
        }
        
  }
  visiblePagarForm:boolean=false;
  
  campoValido(nombre: string) {
    return (
      this.formPago.controls[nombre].errors &&
      this.formPago.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.formPago.controls[nombre].errors &&
      this.formPago.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  get tipoPagoFormSelected(){
    return this.formPago.get('metodoPago')?.value;
  }
  getMontoRecibidoErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['min']){
      return `El minimo es de ${errors?.['min'].min} `;
    } else if(errors?.['amountMismatch']){
      return `El monto de recibo debe ser igual al monto de afiliacion`
    }
    return '';
  }
  getMonedaRecibidoErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['amountMismatch']){
      return `La moneda de recibo debe ser igual al pago`
    }
    return '';
  }
  getNroReciboErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['minlength']){
      return `El minimo es de ${errors?.['minlength'].requiredLength}`;
    }else if(errors?.['maxlength']){
      return `el maximo es de ${errors?.['maxlength'].requiredLength}`;
    }
    return '';
    
  }
  getEntidadErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['minlength']){
      return `El minimo es de ${errors?.['minlength'].requiredLength}`;
    }else if(errors?.['maxlength']){
      return `el maximo es de ${errors?.['maxlength'].requiredLength}`;
    }
    return '';
  }
  getNroCuentaErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['minlength']){
      return `El minimo es de ${errors?.['minlength'].requiredLength}`;
    }else if(errors?.['maxlength']){
      return `el maximo es de ${errors?.['maxlength'].requiredLength}`;
    }
    return '';
  }
  getRemitenteErrors(campo:string){
    const errors = this.formPago.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    } else if(errors?.['minlength']){
      return `El minimo es de ${errors?.['minlength'].requiredLength}`;
    }else if(errors?.['maxlength']){
      return `el maximo es de ${errors?.['maxlength'].requiredLength}`;
    } else if(errors?.['pattern']){
      return `El campo contiene caracteres invalidos`
    }
    return '';
  }

  validForm(){
    console.log(this.formPago);
    console.log(this.formPago.value);
    this.formPago.markAllAsTouched();
    if(this.formPago.invalid) return;

    this.registrarFormulario(this.formPago.value);
  }
  mostrarForm(){
    this.visiblePagarForm=true;
  }
  registrarFormulario(form: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro de registrar este pago con el tipo de pago ${form.metodoPago}?`,
      header: 'Confirmar Acción de Registor de Pago',
      icon: 'pi pi-info-circle',
      accept: () => {
        if(form.metodoPago === MetodoPago.presencial){
          this.perfilService.registrarPagoPresencial(form).subscribe(res=>{
            console.log('res presencial',res);

            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'REGISTRO DE PAGO EXITOSO!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.obtenerPago();
              this.visibleDialogReport=true;
              
            }
          })
        }else if(form.metodoPago === MetodoPago.deposito){
          this.perfilService.registrarPagoDeposito(form).subscribe(res=>{
            console.log('res deposito',res);
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'REGISTRO DE DEPOSITO DE PAGO EXITOSO!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              this.obtenerPago();
              this.visiblePagarForm=false;
              this.visibleUpdatePagoForm=false; 
            }
          })
        }
      },
    });
  }

  updatePagoForm:FormGroup = this.fb.group({
    monto:[,[Validators.required,Validators.min(1)]],
    moneda:[,[Validators.required]],
  });
  visibleUpdatePagoForm:boolean=false;
  visibleDialogReport:boolean=false;
  reporteGenerado:boolean=false;
  generarRecibo(){
    this.reporteGenerado=this.commonAppService.generarReciboDePagoPorAfiliacion({
      ...this.perfil,
      afiliado:this.afiliado,
      }
    )
    console.log(this.reporteGenerado);
  }
  cerrarVentana(){
    if(this.reporteGenerado){
      this.visibleDialogReport=false;
      
      this.visiblePagarForm=false;
      this.visibleUpdatePagoForm=false;
    }else{
      this.confirmationService.confirm({
        message: `¿Está seguro de cerrar la ventana sin generar recibo de pago?`,
        header: 'Confirmar Acción',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.visibleDialogReport=false;
          this.visiblePagarForm=false;
          this.visibleUpdatePagoForm=false;
        },
      });
    }
  }
  validFormUpdate(){
    console.log(this.updatePagoForm);
    console.log(this.updatePagoForm.value);
    if(this.updatePagoForm.invalid) return;
    this.registrarUpdatePagoAfiliado(this.updatePagoForm.value);
  }

  registrarUpdatePagoAfiliado(form:any){
    this.confirmationService.confirm({
      message: `¿Está seguro de realizar el cambio de monto de afiliacon por pagar?`,
      header: 'Confirmar Acción de cambio',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.perfilService.updatePagarAfiliado(this.perfil.id!,form).subscribe(res=>{
          if(res.OK){
            this.messageService.add({
              severity: 'success',
              summary: 'ACTUALIZACIÓN EXITOSA',
              detail: res.message,
              icon: 'pi pi-check',
            });
            
            this.obtenerPago();
            this.visiblePagarForm=false;
            this.visibleUpdatePagoForm=false; 
          }
        })
      }
    })
}
  get formValidUpdate(){
    return this.updatePagoForm.valid && this.updatePagoForm.touched && !this.updatePagoForm.pristine
  }
  mostrarFormUpdate(){
    this.visibleUpdatePagoForm=true;
    this.updatePagoForm.get('monto')?.setValue(this.afiliado.monto);
    this.updatePagoForm.get('moneda')?.setValue(this.afiliado.moneda);
  }
  campoValidoUpdatePago(nombre: string) {
    return (
      this.updatePagoForm.controls[nombre].errors &&
      this.updatePagoForm.controls[nombre].touched
    );
  }
  inputValidUpdatePago(nombre: string) {
    return this.updatePagoForm.controls[nombre].errors &&
      this.updatePagoForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }

  getMontoErrors(campo:string){
    const errors = this.updatePagoForm.get(campo)?.errors;
    if(errors?.['required']){
      return `El campo es requerido`
    } else if(errors?.['min']){
      return `El monto es minimo es ${errors?.['min'].min}`
    }
    return '';
  }
  getMonedaErrors(campo:string){
    const errors = this.updatePagoForm.get(campo)?.errors;
    if(errors?.['required']){
      return `El campo es requerido`
    } 
    return '';
  }

}
