import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagosService } from '../../pagos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LecturasService } from '../lecturas.service';
import { LecturasOptions, Perfil } from 'src/app/interfaces';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedidoresAguaService } from '../../medidores-agua.service';

@Component({
  selector: 'app-modal-reportes',
  templateUrl: './modal-reportes.component.html',
  styles: [
  ]
})
export class ModalReportesComponent {

  @Input()
  visibleModal:boolean=false;
  visible:boolean=false;
  // @Input()
  // lectuaOptions:LecturasOptions={
  //   gestion:new Date().getFullYear(),
  //   mes:'ENERO'
  // };
  perfiles:Perfil[]=[];
  loading:boolean=true;
  title:string='';
  @Output()
  event:EventEmitter<boolean> = new EventEmitter<boolean>()
  constructor(private medidoresService:MedidoresAguaService,
    private lecturasService:LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    private readonly fb:FormBuilder,
  ){}
  total=0;
  tarifasForm:FormGroup=this.fb.group({
    lecturas:this.fb.array([])
  })
  get lecturaArray(){
    return this.tarifasForm.get('lecturas') as FormArray;
  }
  showAfiliados(){
    this.loading=true;
    this.medidoresService.obtenerAfiliadosSinTarifa().subscribe(res=>{
      
      if(res.OK){
        this.perfiles=res.data!.data;
      }
      this.title=res.message;
      this.loading=false;
    })
  }
  showConfirm() {
    if(this.lecturaArray.length===0){
      this.messageService.add({
        severity: 'warn',
        summary: `ERROR EN TARIFAS`,
        detail: `DEBE HABER 1 PERFIL SELECCIONADO COMO MINIMO`,
        life: 5000,
      });
      return;
    }
    if (!this.visible) {
        this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: '¿Esta seguro de realizar el proceso?', detail: 'Se creara reportes de ese mes' });
        this.visible = true;
    }
  }
  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
    this.medidoresService.generarComprobantesSelected(this.tarifasForm.value).subscribe(res=>{
      if(res.OK){
        this.messageService.add({
          severity: 'success',
          summary: 'Ocurrio un error al generar los comprobantes',
          detail: `${res.message}`,
          icon: 'pi pi-check',
        });
        this.showAfiliados();
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Ocurrio un error al generar los comprobantes',
        detail: `${res.message}`,
        icon: 'pi pi-check',
      });
    }
    })
  }

  onReject() {
      this.messageService.clear('confirm');
      this.visible = false;
  }
  selectPlanilla(perfiles:Perfil[]){
    // console.log('selecteds',event);

    for(const per of perfiles){
      for(const asc of per.afiliado?.medidorAsociado!){
        console.log(asc);
        const value = (this.lecturaArray.value as Array<any>).find(res=> res.id===asc.planillas![0].lecturas[0].id)
        if(!value){
          const item = this.fb.group({
            id:[asc.planillas![0].lecturas[0].id,Validators.required]
          })
          this.lecturaArray.push(item);
        }
      }
    }
  }
  unselectPlanilla(event:any){
    for(const asc of event.data.afiliado?.medidorAsociado!){
      const index = (this.lecturaArray.value as Array<any>).findIndex(res=>res.id ===asc.planillas[0].lecturas[0].id);
      if(index!==-1){
        this.lecturaArray.removeAt(index);
      }
    }
  }
}
