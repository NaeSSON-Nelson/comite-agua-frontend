import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlanillaMesLectura } from 'src/app/interfaces';
import { AsociacionesService } from '../asociaciones.service';

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
  lectura:PlanillaMesLectura|null=null;
  constructor(private asociacionService:AsociacionesService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerLecuraDetalles();
  }
  obtenerLecuraDetalles(){
    this.asociacionService.obtenerLectura(this.idLectura).subscribe(res=>{
      this.lectura=res;
      console.log(res);
    })
  }
}
