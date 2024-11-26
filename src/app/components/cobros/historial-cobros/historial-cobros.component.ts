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
  idPerfil!:number;
  @Input()
  visible:boolean=false;
  closable:boolean=true;

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
  activeIndex:number=0;
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
  cambioDeLaDo(){
    if(this.activeIndex===0){

    }else if(this.activeIndex===1){ //OBTENER MULTAS
      this.obtenerMultas();
    }else if(this.activeIndex===2){
      this.obtenerHistorialMultas();
    }
  }
  visibleMultasForm:boolean=false;

  eventReloadFormMulta(event:{visible:boolean,refreshMultas?:boolean}){
    this.visibleMultasForm=event.visible;
    if(event.refreshMultas){
      this.obtenerMultas();
    }
  }
  multasPorPagar:any[]=[];
  multasMessage:string='';
  hayMultas:boolean=false;
  loadingMultasSpinner:boolean=false;
  multasSeleccionadas:MultaServicio[]=[];
  
  @ViewChildren("tpMultas") chart!:  QueryList<TabPanel>;
  obtenerMultas(){
    this.loadingMultasSpinner=true;
    this.hayMultas=false;
    this.cobrosService.obtenerMultasActivas(this.idPerfil).subscribe(res=>{
      if(res.OK){
        // console.log(res);
        this.multasPorPagar=res.data!;
        this.multasMessage='';
        this.hayMultas=true;
      }else{
        this.hayMultas=false;
        this.multasMessage='El perfil no tiene multas por pagar';
      }
      this.loadingMultasSpinner=false;
    })
  }
  obtenerHistorialMultas(){
    this.cobrosService.ObtenerMultasHistorial(this.perfil.id!,this.dataPaginator).subscribe(res=>{
      if(res.OK){
        // console.log(res);
        this.multasPorPagar=res.data.data;
        this.dataPaginator.limit=res.data.limit;
      this.dataPaginator.offset=res.data.offset;
      this.dataPaginator.order=res.data.order;
      this.dataPaginator.size=res.data.size;
        this.multasMessage='';
        this.hayMultas=true;
      }else{
        this.hayMultas=false;
        this.multasMessage='El perfil no tiene multas por pagar';
      }
      this.loadingMultasSpinner=false;
    })
  }
  visibleDetallesMulta:boolean=false;

  multaIdSelect:number=-1;
  multaDetalles(event:any){
    this.multaIdSelect=event.id;
    this.visibleDetallesMulta=true;
  }
  visiblePagarMultaForm:boolean=false;
  formPagarMultasVisible(event:{visible:boolean,refreshMultas?:boolean}){
    this.visiblePagarMultaForm=event.visible;
    if(event.refreshMultas)this.obtenerMultas();
  }

  dataPaginator: PaginatorFind = {
    offset:0,
    limit:50,
    order:'ASC',
    sort:'id',
  };
  loadCustomers(filters:any){

    console.log('customers',filters);
    if(filters.sortField){
      this.dataPaginator.sort=filters.sortField;
      this.dataPaginator.order= filters.sortOrder===1 ?'ASC': 'DESC';
    }
    this.dataPaginator.offset=filters.first
    this.dataPaginator.limit=filters.rows
    // if(filters.globalFilter){
    //   if(filters.globalFilter.value.length===0)
    //   delete this.dataPaginator.q
    //   else this.dataPaginator.q = filters.globalFilter.value
    // }
    this.obtenerHistorialMultas();
  }
  visibleDetallesLecturaPago:boolean=false;
  idLecturaSelectedDetalles:number=-1;
  selectLectura(event:any){
    console.log(event);
    this.idLecturaSelectedDetalles=event.id;
    this.visibleDetallesLecturaPago=true;
  }
}
