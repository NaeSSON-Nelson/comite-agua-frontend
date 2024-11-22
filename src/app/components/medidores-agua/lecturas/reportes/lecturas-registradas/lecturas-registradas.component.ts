import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Barrio, LecturasOptions, PlanillaMesLectura, MesSeguimientoRegistroLectura, Perfil } from 'src/app/interfaces';
import { LecturasService } from '../../lecturas.service';
import { CommonAppService } from 'src/app/common/common-app.service';

@Component({
  selector: 'app-lecturas-registradas',
  templateUrl: './lecturas-registradas.component.html',
  styles: [
  ]
})
export class LecturasRegistradasComponent {
  @Input()
  visible=false;
  data:Perfil[]=[];
  lecturas:PlanillaMesLectura[]=[];
  //titleLecturas='Debe seleccionar una año de gestion'
  title=`Registro de Lectura `;
  @Output()
  closePlanilla:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly lecturasService:LecturasService,
    public readonly commonAppService:CommonAppService,){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.lecturasService.perfilesLecturas.subscribe({
      next:res=>{
        console.log(res);
        this.data=res.data;
      }
    })
  }
  @Input()
  lecturasOptions:LecturasOptions={
    
  }
  close(){
    this.visible=false;
    this.closePlanilla.emit(this.visible);
  }
  mostrarDetalles(){
    this.lecturasService.PlanillasPorMes(this.lecturasOptions).subscribe({
      next:res=>{
        console.log(res);
      }
    })
  }
  changeBarrio(event:any){
    console.log(event.value);
    this.lecturasOptions.barrio=event.value;
    this.mostrarDetalles();
  }
}
