import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { Medidor, MesLectura } from 'src/app/interfaces';

@Component({
  selector: 'app-gestion-planillas',
  templateUrl: './gestion-planillas.component.html',
  styleUrls:['./gestion-planillas.component.css'],
})
export class GestionPlanillasComponent {

  @Input()
  visible:boolean=false;
  visibleLecturaModal:boolean=false;
  visibleComprobanteModal:boolean=false;
  @Input()
  medidor!:Medidor;
  planillas:any[]=[];
  lecturas:MesLectura[]=[];
  titleLecturas='Debe seleccionar una año de gestion'
  @Output()
  closePlanilla:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly medidorService:MedidoresAguaService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
  close(){
    this.visible=false;
    this.closePlanilla.emit(this.visible);
  }
  mostrarDetalles(){
    this.medidorService.listarPlanillasMedidor(this.medidor.id!).subscribe(res=>{
      // console.log(res);
      this.planillas = res.map(res=>{
        return{
          label: res.gestion.toString(),
          value:res.id
        }
      })
    });
  }
  mostrarLecturas(event:any){
    // console.log(event.value);
    this.medidorService.listarLecturasPlanilla(event.value).subscribe(res=>{
      // console.log(res);
      this.lecturas=res;
      if(res.length===0){
        this.titleLecturas='NO HAY LECTURAS DE ESA GESTION'
      }
    })
  }
  idLectura:number=0;
  detallesLectura(idLectura:number){
    this.idLectura=idLectura;
    this.visibleLecturaModal=true;
  }
  comprobanteLectura(idLectura:number){
    this.idLectura=idLectura;
    this.visibleComprobanteModal=true;
    
  }
  justifyOptions: any[] = [
    { icon: 'pi pi-list', justify: 'Left' , },
    { icon: 'pi pi-credit-card', justify: 'Right' },];
    options($event:any,indice:number){
      console.log($event);
      if($event.index===0){
        this.detallesLectura(indice);
      }else if($event.index===1){
        this.comprobanteLectura(indice);
      }
    }
}
