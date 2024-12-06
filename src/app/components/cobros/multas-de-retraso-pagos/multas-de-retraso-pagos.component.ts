import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { MessageService } from 'primeng/api';
import { MultaServicio, PaginatorFind, Perfil } from 'src/app/interfaces';

@Component({
  selector: 'app-multas-de-retraso-pagos',
  templateUrl: './multas-de-retraso-pagos.component.html',
  styles: [
  ]
})
export class MultasDeRetrasoPagosComponent {

  @Input()
  visible:boolean=false;
  @Input()
  idPerfil!:number;
  perfil!:Perfil;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private cobrosService:CobrosService,
              private messageService:MessageService,
  ){}
  activeIndex:number=0;
  cambioDeLaDo(){
    if(this.activeIndex===0){

    }else if(this.activeIndex===1){ //OBTENER MULTAS
      this.obtenerMultas();
    }else if(this.activeIndex===2){
      this.obtenerHistorialMultas();
    }
  }
  
  loadingMultasSpinner:boolean=false;
  hayMultas:boolean=false;
  multasPorPagar:any[]=[];
  multasMessage:string='';
  multasSeleccionadas:MultaServicio[]=[];
  visibleMultasForm:boolean=false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cobrosService.perfil.subscribe(res=>{
      this.perfil=res;
      
    })
    this.obtenerPerfil();
  }
  
  obtenerPerfil(){
    this.cobrosService.getAfiliadoMedidores(this.idPerfil).subscribe(res=>{
      if(res.OK){
        this.perfil=res.data!;
      }
    })
  }
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
  
  eventReloadFormMulta(event:{visible:boolean,refreshMultas?:boolean}){
    this.visibleMultasForm=event.visible;
    if(event.refreshMultas){
      this.obtenerMultas();
    }
  }
  dataPaginator: PaginatorFind = {
    offset:0,
    limit:50,
    order:'ASC',
    sort:'id',
  };
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
}
