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
  @Input()
  lectuaOptions:LecturasOptions={
    gestion:new Date().getFullYear(),
    mes:'ENERO'
  };
  perfiles:Perfil[]=[];
  loading:boolean=true;
  @Output()
  event:EventEmitter<boolean> = new EventEmitter<boolean>()
  constructor(private pagosService:PagosService,
    private lecturasService:LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,){}
  total=0;
  showAfiliados(){
    this.pagosService.obtenerAfiliadosSinTarifa(this.lectuaOptions).subscribe(res=>{
      this.perfiles=res;
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
      this.total=res.length;
      if(res.length===0){
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
    })
  }

  onReject() {
      this.messageService.clear('confirm');
      this.visible = false;
  }
}
