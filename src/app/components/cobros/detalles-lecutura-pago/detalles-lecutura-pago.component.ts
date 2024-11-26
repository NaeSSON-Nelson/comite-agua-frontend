import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { MessageService } from 'primeng/api';
import { PlanillaMesLectura } from 'src/app/interfaces';

@Component({
  selector: 'app-detalles-lecutura-pago',
  templateUrl: './detalles-lecutura-pago.component.html',
  styles: [
  ]
})
export class DetallesLecuturaPagoComponent {

  @Input()
  visible:boolean=false;
  @Input()
  idLectura:number=-1;
  lectura!:PlanillaMesLectura;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService:MessageService,
  ){}

  obtenerLecturaPago(){
    if(this.idLectura>0){
      this.cobrosService.obtenerLecturaPago(this.idLectura).subscribe(res=>{
        if(res.OK){
          this.lectura=res.data!;
        }
      })
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Ocurrió un error al modificar!!',
        detail: `Detalles del error: ???console`,
        life: 5000,
        icon: 'pi pi-times',
      });
    }
  }
}
