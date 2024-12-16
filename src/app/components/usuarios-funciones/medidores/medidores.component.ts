import { Component } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { Medidor, MultaServicio, PaginatorFind } from 'src/app/interfaces';
import { MedidorAsociado, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.css']
})
export class MedidoresComponent {

  selectMedidoresRelacion:any[]=[];
  medidorAsc:MedidorAsociado|null =null;
  planillasSelect:any=[];
  planillaSelected:PlanillaLecturas|null=null;
  titleLecturas='Debe seleccionar una año de gestion';
  titleMultas='';
  loading:boolean=false;
  showLecturas:boolean=false;
  multas:MultaServicio[]=[];
  visibleTablaMultas:boolean=false;
  constructor(private usuarioFunciones:UsuarioFuncionesService,
    private readonly messageService: MessageService,){}
  ngOnInit(): void {

    this.usuarioFunciones.multasAsociacion.subscribe(res=>{
      console.log('res multas',res);
      this.multas=res.data;
      this.visibleTablaMultas=true;
      if(this.multas.length===0){
        this.titleMultas='* El medidor asociado no tiene multas'
      }
    })
    this.usuarioFunciones.PlanillaLecturas.subscribe(res=>{
      this.planillaSelected=res;
      this.showLecturas=true;
      // console.log(res);
      if(res.lecturas.length===0){
        this.titleLecturas='NO HAY LECTURAS DE ESA GESTION'
      }
    })
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getSelectsMedidores();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }
  lecturaSelected =0;
  visible=false;
  getSelectsMedidores(){
    this.usuarioFunciones.getSelectsMedidores().subscribe(res=>{
      console.log('medidores select user',res);
      if(res.OK){
        this.selectMedidoresRelacion=res.data!.map(asc=>{
          return{
            label:`${asc.medidor?.nroMedidor} ${asc.isActive?'':'( Asociación cerrada)'}`,
            value:asc.id
          }
        });
      }
    })
  }
  obtenerMedidor(event:any){
    // console.log(event);
    this.showLecturas=false;
    this.usuarioFunciones.getMedidor(event.value).subscribe(res=>{
      console.log(res);
      if(res.OK){
        this.medidorAsc=res.data!;
        this.planillasSelect = this.medidorAsc.planillas?.map(plan=>{
          return {
            label:plan.gestion.toString(),
            value:plan.id
          }
        })
      }
    })
  }
  
  obtenerLecturas(event:any){
    this.usuarioFunciones.getLecturasMedidor(event.value).subscribe(res=>{
      if(!res.OK){
        this.messageService.add({
          severity: 'error',
          summary: 'Error obtenido',
          detail:res.message,
          life: 5000,
        });
        this.showLecturas=true;
      }
    })
  }
  obtenerLectura(id:number){
    console.log(id);
    this.lecturaSelected=id;
    this.visible=true;
  }
  activeIndex:number=0;
  cambioDeLaDo(){
    if(this.activeIndex===0){
      
    }else if(this.activeIndex===1){ //OBTENER MULTAS
      this.obtenerMultasAsociado();
    }
  }
  loadingMultasSpinner:boolean=false;
  obtenerMultasAsociado(){
    this.loadingMultasSpinner=true;
    this.usuarioFunciones.obtenerMultasMedidorAsociado(this.medidorAsc!.id!,this.dataPaginator).subscribe(res=>{
      console.log('res multas',res);
      this.loadingMultasSpinner=false;
    })
  }
  dataPaginator: PaginatorFind = {
      offset:0,
      limit:10,
    };
    loadCustomers(filters:any){

      this.dataPaginator.offset=filters.first
      this.dataPaginator.limit=filters.rows
      
      this.obtenerMultasAsociado();
    }  
    showReportImage:boolean=false;
}
