import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MesLectura } from 'src/app/interfaces';
import { MedidoresAguaService } from '../medidores-agua.service';

@Component({
  selector: 'app-detalles-lectura',
  templateUrl: './detalles-lectura.component.html',
  styles: [
  ]
})
export class DetallesLecturaComponent {

  @Input()
  idLectura!:number;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  lectura:MesLectura|null=null;
  constructor(private medidorService:MedidoresAguaService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerLecuraDetalles();
  }
  obtenerLecuraDetalles(){
    this.medidorService.obtenerLectura(this.idLectura).subscribe(res=>{
      this.lectura=res;
      console.log(res);
    })
  }
}
