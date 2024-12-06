import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { MultaServicio, PaginatorFind, Perfil } from 'src/app/interfaces';
import { CobrosService } from '../cobros.service';
import { PlanillaMesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { CommonAppService } from 'src/app/common/common-app.service';
import { TabPanel } from 'primeng/tabview';

@Component({
  selector: 'app-historial-cobros',
  templateUrl: './historial-cobros.component.html',
  styles: [
  ]
})
export class HistorialCobrosComponent {
  
  @Input()
  visible:boolean=false;
  closable:boolean=true;
  @Input()
  idPerfil!:number;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();

  perfil!:Perfil;
  planillas:any[]=[];
  lecturas:PlanillaMesLectura[]=[];
  lecturasSelected:PlanillaMesLectura[]=[];
  medidoresDeudas:TreeNode<any> []=[];
  comprobantesPagar:any[]=[];
  selectedNodes: any =null;
  loading:boolean=true;
  messagePlanillas:string='Seleccione primer un medidor';
  visibleHistorial:boolean=false;
  constructor(private cobrosService:CobrosService,
              private readonly commonAppService:CommonAppService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cobrosService.perfil.subscribe(res=>{
      this.perfil=res;
      
    })
    this.obtenerPerfil();
  }
  // tipoModel:'HISTORIAL'|'MULTAS'|'CREATE-MULTA'|'HISTORIA-MULTAS'='HISTORIAL';
  
  obtenerPerfil(){
    this.loading=true;
    this.cobrosService.getAfiliadoMedidores(this.idPerfil).subscribe(res=>{
      if(res.OK){
        this.perfil=res.data!;
      }
      this.loading=false;
    })
  }
  nroMedidor:string='';
  obtenerGestiones(event:any){
    if(event.value){
      this.cobrosService.getGestionesMedidor(this.perfil!.id!,event.value).subscribe(res=>{
        this.planillas=res.data?.map(asc=>{
          return {
            gestion:asc.gestion+'',
            value:asc.id,
          }
        }) || [];
        this.nroMedidor=event.value;
        if(this.planillas.length===0) this.messagePlanillas='NO HAY PLANILLAS';
        if(this.lecturas.length>0)
        this.lecturas=[];
      })
    }
  }
  showTable=false;
  tableReport='';
  gestionIdSelected:number=-1;
  obtenerLecturas(event:any){
    console.log(event);
    if(event.value && this.nroMedidor.length>0){
      this.gestionIdSelected=event.value;
      this.cobrosService.getLecturasPlanillas(this.nroMedidor,event.value).subscribe(res=>{
        console.log(res);
        if(res.data!.length>0){
          this.lecturas=res.data!;
          this.showTable=true;
        }else{
          this.tableReport=`No hay cobros de la fecha seleccionada`
          this.showTable=false;
        }
      })
    }
  }
  generarPdf(){
    console.log(this.lecturasSelected);
    // this.commonAppService.generarReciboDePago(this.planillas.find(res=>res.value===this.gestionIdSelected),this.lecturasSelected,this.perfil)
  }
  medidoresGes(){
    if(this.perfil){
      return this.perfil.afiliado!.medidorAsociado!.map(asc=>asc.medidor!);
    }
    return []
  }
  

  
  @ViewChildren("tpMultas") chart!:  QueryList<TabPanel>;
  


  visibleDetallesLecturaPago:boolean=false;
  idLecturaSelectedDetalles:number=-1;
  selectLectura(event:any){
    console.log(event);
    this.idLecturaSelectedDetalles=event.id;
    this.visibleDetallesLecturaPago=true;
  }
}
