import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsociacionesService } from '../asociaciones.service';
import { MessageService } from 'primeng/api';
import { PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { PaginatorFind } from 'src/app/interfaces';

@Component({
  selector: 'app-gestiones',
  templateUrl: './gestiones.component.html',
  styles: [
  ]
})
export class GestionesComponent {
  @Input()
  visible:boolean=false;

  visibleAdminGestion:boolean=false;
  @Input()
  idAsociacion:number=-1;
  typeGestionAdmin:'ACTUAL'|'PASADO'='PASADO'
  titleLecturas='Sin planillas de gestiones';
  data:PlanillaLecturas[]=[]
  gestionSelected:PlanillaLecturas|null=null;
  @Output()
  closePlanilla:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly asociacionService:AsociacionesService,
    private readonly messageService: MessageService,){}
    dataPaginator: PaginatorFind = {
      offset:0,
      limit:10
    };
  showGestiones(){
    if(this.idAsociacion>0){
      this.asociacionService.findGestiones(this.idAsociacion,this.dataPaginator).subscribe(res=>{
        this.data=res.data.data;
        console.log('res data gestiones',res);
      })
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: `OCURRIO UN ERROR AL OBTENER LA DATA`,
        detail: `Se debe mandar la asociacion valida`,
        life: 5000,
      });

    }
  }
  loadCustomers(filters:any){
    console.log(filters);
  }
  select(event:any){
    
    this.typeGestionAdmin='PASADO';
    this.visibleAdminGestion=true;
    this.gestionSelected=event;
  }
  openAdminGes(){
    this.typeGestionAdmin='ACTUAL';
    this.visibleAdminGestion=true;
  }
  closeAdminGestiones(event:any){
    this.visibleAdminGestion=event;
    this.typeGestionAdmin='PASADO';
    this.gestionSelected=null;
    this.showGestiones();
  }
}
