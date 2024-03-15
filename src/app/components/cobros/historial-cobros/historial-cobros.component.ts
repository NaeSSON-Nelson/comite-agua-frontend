import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Perfil } from 'src/app/interfaces';
import { CobrosService } from '../cobros.service';
import { MesLectura, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { CommonAppService } from 'src/app/common/common-app.service';

@Component({
  selector: 'app-historial-cobros',
  templateUrl: './historial-cobros.component.html',
  styles: [
  ]
})
export class HistorialCobrosComponent {
  @Input()
  idPerfil!:number;
  @Input()
  visible:boolean=false;
  closable:boolean=true;

  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();

  perfil:Perfil|null=null;
  planillas:PlanillaLecturas[]=[];
  lecturas:MesLectura[]=[];
  lecturasSelected:MesLectura[]=[];
  medidoresDeudas:TreeNode<any> []=[];
  comprobantesPagar:any[]=[];
  selectedNodes: any =null;
  loading:boolean=false;
  messagePlanillas:string='Seleccione primer un medidor';
  constructor(private cobrosService:CobrosService,
              private readonly commonAppService:CommonAppService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cobrosService.perfil.subscribe(res=>{
      this.perfil=res;
      console.log(res);
      
    })
    this.obtenerComprobanteDetalles();
  }
  obtenerComprobanteDetalles(){
    this.loading=true;
    this.cobrosService.getAfiliadoMedidores(this.idPerfil).subscribe(res=>{
      this.perfil=res.data || null;
      console.log(res);
      if(res.OK){
      }
      this.loading=false;
    })
  }
  nroMedidor:string='';
  obtenerGestiones(event:any){
    console.log(event);
    if(event.value){
      this.cobrosService.getGestionesMedidor(this.perfil!.id!,event.value).subscribe(res=>{
        this.planillas=res.data || [];
        this.nroMedidor=event.value;
        if(this.planillas.length===0) this.messagePlanillas='NO HAY PLANILLAS';
        if(this.lecturas.length>0)
        this.lecturas=[];
      })
    }
  }
  showTable=false;

  tableReport='';
  
  obtenerLecturas(event:any){
    console.log(event);
    if(event.value && this.nroMedidor.length>0){
      this.cobrosService.getLecturasPlanillas(this.nroMedidor,event.value).subscribe(res=>{
        console.log(res);
        if(res.data!.length>0){
          this.lecturas=res.data!;
          this.showTable=true;
        }else{
          this.tableReport=`No hay cobros de la fecha seleccionada`
        }
      })
    }
  }
  generarPdf(){
    console.log(this.lecturasSelected);
    this.commonAppService.comprobantesPdfGenerated(this.lecturasSelected,this.perfil!)
  }
}
