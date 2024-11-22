import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComprobantePorPago } from 'src/app/interfaces/pagos-services.interface';
import { PagosService } from '../../medidores-agua/pagos.service';
import { PlanillaMesLectura } from 'src/app/interfaces';

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
  medicion:string='';
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  lectura:PlanillaMesLectura|null=null;
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
