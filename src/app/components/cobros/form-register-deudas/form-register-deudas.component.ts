import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { ComprobantePorPago, GestionesPorCobrar, PagosForm } from 'src/app/interfaces/pagos-services.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patternCI, } from 'src/app/patterns/forms-patterns';
import { CommonAppService } from 'src/app/common/common-app.service';
import { PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { ComprobanteDePagoDeMultas, MultaServicio, Perfil, ResponseResultData } from 'src/app/interfaces';

@Component({
  selector: 'app-form-register-deudas',
  templateUrl: './form-register-deudas.component.html',
  styles: [
  ]
})
export class FormRegisterDeudasComponent {

  @Input()
  porPagar:GestionesPorCobrar[]=[];
  @Input()
  multasPorPagarSelected:MultaServicio[]=[];
  // loading:boolean=false;
  @Input()
  perfil!:Perfil;
  @Input()
  totalPagar:number=0;
  @Input()
  visible:boolean=false;
  visibleRegisters:boolean=false;
  closable:boolean=true;
  @Output()
  porPagarPagadosEmit:EventEmitter<GestionesPorCobrar[]> = new EventEmitter<any[]>();
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  pagado:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    private readonly commonAppService:CommonAppService,
    private fb: FormBuilder){}
    pagarForm: FormGroup = this.fb.group(
      {
        perfilId:     [,Validators.required],
         comprobantes: this.fb.array([]),
         multas:this.fb.array([]),
      }
    );
  ngOnInit(): void {
    
  }
  changesModal(){
    this.pagarForm.reset();
    this.comprobantesArray.clear();
    this.pagarForm.get('perfilId')?.setValue(this.perfil.id);
    for(const gest of this.porPagar){
      gest.comprobantes.forEach(por=>{
        const comproValid = this.fb.group({
          id:[por.idComprobante,Validators.required]
        })
        this.comprobantesArray.push(comproValid);
      }); 
    }
    for(const multa of this.multasPorPagarSelected){
        const multValid = this.fb.group({
          id:[multa.id,Validators.required],
        })
        this.multasArray.push(multValid);
      
    }
  }
  validForm(){
   console.log(this.pagarForm); 
   console.log(this.pagarForm.value); 
   console.log('POR PAGAR SELECTED',this.porPagar);
   console.log('MULTAS POR PAGAR SELECTED',this.multasPorPagarSelected);
   this.pagarForm.markAllAsTouched()
   if(this.pagarForm.invalid) {
    return};
    if(this.porPagar.length=== 0 && this.multasPorPagarSelected.length === 0){
      this.messageService.add({ severity: 'warn', summary:'NO HAY NINGUNA DEUDA POR PAGAR SELECCIONADA',life:2000 });
       
    }
   const {perfilId,comprobantes,multas} = this.pagarForm.value;
    // console.log(titular,ciTitular,perfilId,comprobantes);
    this.registrarPagos({
    perfilId,comprobantes:comprobantes.map((res:any)=>res.id),multas:multas.map((res:any)=>res.id)
   })
  }

  registrarPagos(pagosForm:PagosForm){
    this.confirmationService.confirm({
      message: `¿Está seguro de registrar los pagos seleccionados '}?<br>
      Total a registrar : <p class="font-bold"> ${this.totalPagar} Bs. </p><br>`,
      header: 'Confirmar Registro de deuda',
      icon: 'pi pi-info-circle',
      accept:()=>{
        this.sendRegister(pagosForm);
      },
    });
   
  }

  printPDFDetailsPago(){
    this.imprimido=this.commonAppService.generarReciboDePagoLecturasOrMultas(this.logosRecibos.planillasPagadas,this.perfil,this.logosRecibos.multasPagadas)

    // this.closeModal();
  }
  imprimido:boolean=false;
  closePrintRecibos(){
    if(!this.imprimido){
      this.confirmationService.confirm({
        message: 'ESTA SEGURO DE CERRAR LA VENTANA SIN HABER IMPRIMIDO LOS RECIBOS?',
        header: 'CONFIRMAR ACCION DE CIERRE',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.visibleRegisters=false;
          this.closeModal();
        }
    });      
    }else{
      this.visibleRegisters=false;
      this.closeModal();
    }
  }
  closeModal(){
    this.totalPagar=0;
    this.logosRecibos={multasPagadas:[],planillasPagadas:[]};
    this.porPagarPagadosEmit.emit([]);
    this.pagado.emit(false)
    this.visible=false;

  };
  logosRecibos:{planillasPagadas:PlanillaLecturas[],multasPagadas:ComprobanteDePagoDeMultas[]}={multasPagadas:[],planillasPagadas:[]};
  sendRegister(pagosForm:PagosForm){
    this.cobrosService.registrarPagos(pagosForm).subscribe(res=>{
      console.log(res);
      if(res.OK){
        this.messageService.add({ severity: 'success', summary:'REGISTRO DE PAGOS', detail: res.message });
        this.logosRecibos=(res as ResponseResultData<{planillasPagadas:PlanillaLecturas[],multasPagadas:ComprobanteDePagoDeMultas[]}>).data!;
        this.visibleRegisters=true;
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
  get multasArray(){
    return this.pagarForm.controls['multas']  as FormArray;
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
  // getTitularErrors(campo: string) {
  //   const errors = this.pagarForm.get(campo)?.errors;
  //   if (errors?.['pattern']) {
  //     return 'El campo contiene caracteres invalidos';
  //   } else if(errors?.['required']){
  //     return 'El campo es obligatorio'
  //   }
  //   return '';
  // }
  // getCiTitularErrors(campo: string) {
  //   const errors = this.pagarForm.get(campo)?.errors;
  //   if (errors?.['pattern']) {
  //     return 'El campo contiene caracteres invalidos';
  //   } else if(errors?.['required']){
  //     return 'El campo es obligatorio'
  //   }
  //   return '';
  // }
  // lastMulta(comp:any,multas:any[]){
    
  //   return false;
  // };
  // tieneMultas(){
  //   for(const gestion of this.porPagar){
  //     if(gestion.multas?.length>0) return true;
  //   }
  //   return false;
  // }
  // multaColor(rowData:any){
  //   if(rowData.isMulta){
  //     for(const pagar of this.porPagar){
  //       for(const multa of pagar.multas)
  //         if(multa.id === rowData.multa.id){
  //           return `text-center ${multa.multaColor}`
  //         }
  //       }
  //   }
  //   return 'text-center'
  // }
}
