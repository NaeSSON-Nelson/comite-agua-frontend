import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { ComprobantePorPago, PagosForm } from 'src/app/interfaces/pagos-services.interface';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patternCI, } from 'src/app/patterns/forms-patterns';

@Component({
  selector: 'app-form-register-deudas',
  templateUrl: './form-register-deudas.component.html',
  styles: [
  ]
})
export class FormRegisterDeudasComponent {

  @Input()
  porPagar:any[]=[];
  // loading:boolean=false;
  @Input()
  idPerfil:number=-1;
  @Input()
  totalPagar:number=0;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService: MessageService,
    private fb: FormBuilder){}
    pagarForm: FormGroup = this.fb.group(
      {
        perfilId:     [,Validators.required],
        titular:      [,[Validators.required,Validators.minLength(1)]],
        ciTitular:    [,[Validators.required,Validators.pattern(patternCI),Validators.minLength(1)]],
        comprobantes: this.fb.array([],Validators.required),
      }
    );
  ngOnInit(): void {
    console.log(this.idPerfil);
    console.log(this.porPagar);
    if(this.idPerfil>0){
      this.pagarForm.get('perfilId')?.setValue(this.idPerfil);
      this.porPagar.forEach(por=>{
        const comproValid = this.fb.group({
          id:[por.idComprobante,Validators.required]
        })
        this.comprobantesArray.push(comproValid);
      })
    }
  }
  validForm(){
   console.log(this.pagarForm); 
   console.log(this.pagarForm.value); 
   if(this.pagarForm.invalid) return;

   const {titular,ciTitular,perfilId,comprobantes} = this.pagarForm.value;
    // console.log(titular,ciTitular,perfilId,comprobantes);
    // console.log(this.comprobantesArray.value.map((res:any)=>res.id));
    this.registrarPagos({
    ciTitular,titular,perfilId,comprobantes:comprobantes.map((res:any)=>res.id)
   })
  }
  registrarPagos(pagosForm:PagosForm){
    this.cobrosService.registrarPagos(pagosForm).subscribe(res=>{
      if(res.OK){
        this.messageService.add({ severity: 'success', summary:'REGISTRO DE PAGOS', detail: res.message });
        this.eventVisible.emit(false)
      }else{
        switch (res.statusCode) {
          case 400:
            this.messageService.add({ severity: 'warn', summary: 'ERROR AL REGISTRAR', detail: res.message,life:5000 });
            
            break;
            default:
            this.messageService.add({ severity: 'error', summary: 'ERROR NO CONTROLADO', detail: res.message,life:5000 });
            break;
        }
           
      }
    })
  }
  get comprobantesArray(){
    return this.pagarForm.controls['comprobantes']  as FormArray;
  }
  limpiarCampo(campo: string) {
    if (
      !this.pagarForm.get(campo)?.pristine &&
      this.pagarForm.get(campo)?.value?.length === 0
    ) {
      this.pagarForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.pagarForm.controls[nombre].errors &&
      this.pagarForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.pagarForm.controls[nombre].errors &&
      this.pagarForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.pagarForm.controls[nombre].valid &&
        this.pagarForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  getTitularErrors(campo: string) {
    const errors = this.pagarForm.get(campo)?.errors;
    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if(errors?.['required']){
      return 'El campo es obligatorio'
    }
    return '';
  }
  getCiTitularErrors(campo: string) {
    const errors = this.pagarForm.get(campo)?.errors;
    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if(errors?.['required']){
      return 'El campo es obligatorio'
    }
    return '';
  }
}
