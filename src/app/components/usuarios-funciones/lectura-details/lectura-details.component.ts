import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { MesLectura } from 'src/app/interfaces';

@Component({
  selector: 'app-lectura-details',
  templateUrl: './lectura-details.component.html',
  styleUrls: ['./lectura-details.component.css']
})
export class LecturaDetailsComponent {
  @Input()
  idLectura!:number;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  lectura:MesLectura|null=null;
  constructor(private readonly usuarioService:UsuarioFuncionesService){
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerLecuraDetalles();
    // console.log('inicio papita');
  }
  obtenerLecuraDetalles(){
    this.usuarioService.getLectura(this.idLectura).subscribe(res=>{
      if(res.OK){
        this.lectura = res.data!;
        console.log(res.data);
      }
    })
  }
}
