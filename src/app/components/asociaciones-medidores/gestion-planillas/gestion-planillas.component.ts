import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedidoresAguaService } from '../../medidores-agua/medidores-agua.service';
import { Medidor, MedidorAsociado, PlanillaMesLectura } from 'src/app/interfaces';
import { AsociacionesService } from '../asociaciones.service';

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
  medidor!:MedidorAsociado;
  planillas:any[]=[];
  lecturas:PlanillaMesLectura[]=[];
  titleLecturas='Debe seleccionar una año de gestion'
  @Output()
  closePlanilla:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly asociacionService:AsociacionesService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.medidor);
  }
  close(){
    this.visible=false;
    this.closePlanilla.emit(this.visible);
  }
  mostrarDetalles(){
    this.asociacionService.listarPlanillasMedidor(this.medidor.id!).subscribe(res=>{
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
    this.asociacionService.listarLecturasPlanilla(event.value).subscribe(res=>{
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
    options(indice:number){
        this.comprobanteLectura(indice);
    }
}
