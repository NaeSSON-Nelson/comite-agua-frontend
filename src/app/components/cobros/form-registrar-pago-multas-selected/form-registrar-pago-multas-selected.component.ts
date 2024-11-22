import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MultaServicio, Perfil } from 'src/app/interfaces';
import { CobrosService } from '../cobros.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';

@Component({
  selector: 'app-form-registrar-pago-multas-selected',
  templateUrl: './form-registrar-pago-multas-selected.component.html',
  styles: [`
    .col-color{
      background-color:#f8f9fa
    }`
  ]
})
export class FormRegistrarPagoMultasSelectedComponent {

  @Input()
  visible:boolean=false;
  @Input()
  multasSelected:any[]=[];
  multas:MultaServicio[]=[];
  multasReloaded:MultaServicio[]=[];
  @Input()
  perfil!:Perfil;
  @Output()
  eventVisible:EventEmitter<{visible:boolean,refreshMultas?:boolean}> = new EventEmitter<{visible:boolean,refreshMultas?:boolean}>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService:MessageService,
    private readonly fb:FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly commonAppService:CommonAppService
  ){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.perfil);
    console.log(this.multas);
    console.log(this.multasSelected);
    
    this.obtenerMultas();
    this.multasForm.get('perfilId')?.setValue(this.perfil.id);
  }
  multasForm:FormGroup = this.fb.group({
    perfilId:[,[Validators.required,Validators.min(1)]],
    multas:this.fb.array([],Validators.required)
  });

  get multasArray(){
    return this.multasForm.get('multas') as FormArray;
  }
  obtenerMultas(){
    this.cobrosService.findMultas(this.perfil.id!,this.multasSelected.map(mult=>mult.id)).subscribe(res=>{
      if(res.OK){
        this.multas=res.data!;
        //LLENAR CAMPO FORMULARIO MULTAS
    this.addMultasForm();
      }
    })
  }
  subTotalLecturas(multa:MultaServicio){
    let subTotal:number=0;
    for(const lect of multa.lecturasMultadas){
      subTotal=subTotal+lect.pagar!.monto;
    }
    return Number(subTotal.toFixed(2));

  }
  subTotalMulta(multa:MultaServicio){
    let subTotal:number=0;
    for(const lect of multa.lecturasMultadas){
      subTotal=subTotal+lect.pagar!.monto;
    }
    subTotal=subTotal+Number.parseFloat(multa.monto);
    return Number(subTotal.toFixed(2));
  }
  totalPagarMultas(){
    let totalPagar:number=0;
    for(const multa of this.multas){
      for(const lect of multa.lecturasMultadas){
        totalPagar=totalPagar+lect.pagar!.monto;
      }
      totalPagar=totalPagar+Number.parseFloat(multa.monto);
    }
    return Number(totalPagar.toFixed(2));
  }
  addMultasForm(){
    for(const mult of this.multas){
      const multa = this.fb.group({
        multaId:[mult.id,[Validators.required,Validators.min(1)]],
        medidorAsociadoId:[mult.medidorAsociado.id,[Validators.required,Validators.min(1)]],
        lecturasMultadas: this.fb.array(mult.lecturasMultadas.map(res=>{
            const lectM = this.fb.group({
              lecturaId:[res.id,[Validators.required,Validators.min(1)]]
            })
            return lectM;
        }),Validators.required)
      })
      this.multasArray.push(multa)
    }
  }
  validarForm(){
    console.log(this.multasForm);
    this.multasForm.markAllAsTouched();
    if(this.multasForm.invalid) return;
    this.registrarPagoMulta(this.multasForm.value);
  }

  registrarPagoMulta(form:any){
    this.confirmationService.confirm({
      message: `¿Está seguro de registrar el pago del servicio de multas? <br/>La multa por pagar en total es: Bs. ${this.totalPagarMultas()}`,
      header: 'CONFIRMAR PAGO DE SERVICIO',
      icon: 'pi pi-info-circle',
      blockScroll:true,
      accept: () => {
        this.cobrosService.registrarPagoMultas(form).subscribe(res=>{
          console.log(res);
          if(res.OK){
            this.messageService.add({
              severity: 'success',
              summary: 'MENSAJE DEL SERVIDOR',
              detail: `${res.message}`,
              icon: 'pi pi-check',
            });
            // this.eventVisible.emit({visible:false,refreshMultas:true});
            // this.visible=false;
            
            this.multasReloaded=res.data!;
            this.visibleRegisters=true;
          }
        })
      },
    });
  }
  campoValido(nombre: string) {
    return (
      this.multasForm.controls[nombre].errors &&
      this.multasForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.multasForm.controls[nombre].errors &&
      this.multasForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }

  visibleRegisters:boolean=false;

  printPDFDetailsPagoMulta(){
   this.imprimido = this.commonAppService.generarReciboDePagoDeMultas(this.multasReloaded,this.perfil)
  
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
    this.eventVisible.emit({visible:false,refreshMultas:true})
    this.visible=false;

  };
}
