import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagosService } from '../../pagos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LecturasService } from '../lecturas.service';
import { LecturasOptions, Perfil } from 'src/app/interfaces';

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
  constructor(private pagosService:PagosService,
    private lecturasService:LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,){}
  total=0;
  showAfiliados(){
    this.pagosService.obtenerAfiliadosSinTarifa().subscribe(res=>{
      if(res.OK){
        this.perfiles=res.data!;
      }
      this.title=res.message;
      // console.log(res);
      this.loading=false;
    })
  }
  showConfirm() {
    if (!this.visible) {
        this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: '¿Esta seguro de realizar el proceso?', detail: 'Se creara reportes de ese mes' });
        this.visible = true;
    }
  }
  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
    this.pagosService.generarComprobantes().subscribe(res=>{
      if(res.OK){

        this.total=res.data!.length;
        
        if(res.data!.length===0){
          this.messageService.add({
          severity: 'info',
          summary: 'Respuesta del servidor',
          detail: `No se encontro ninguna lectura para generar reporte, total: ${this.total}`,
          life: 5000,
          icon: 'pi pi-times',
        });
      }else{
        this.messageService.add({
          severity: 'success',
          summary: 'Generacion de comprobantes exitoso!',
          detail: `Se generaron un total de: ${this.total} de comprobantes`,
          icon: 'pi pi-check',
        });
        this.event.emit(false);
      }
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
}
