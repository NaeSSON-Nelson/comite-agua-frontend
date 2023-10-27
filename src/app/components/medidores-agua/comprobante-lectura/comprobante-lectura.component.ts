import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComprobantePorPago } from 'src/app/interfaces/pagos-services.interface';
import { PagosService } from '../pagos.service';
import { MesLectura } from 'src/app/interfaces';

@Component({
  selector: 'app-comprobante-lectura',
  templateUrl: './comprobante-lectura.component.html',
  styles: [
  ]
})
export class ComprobanteLecturaComponent {
  @Input()
  idLectura!:number;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  lectura:MesLectura|null=null;
  constructor(private comprobanteService:PagosService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerComprobanteDetalles();
  }
  obtenerComprobanteDetalles(){
    this.comprobanteService.obtenerComprobantePorPagar(this.idLectura).subscribe(res=>{
      this.lectura=res;
      console.log(res);
    })
  }
}
