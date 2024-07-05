import { Component } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { Medidor } from 'src/app/interfaces';
import { MedidorAsociado, PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.css']
})
export class MedidoresComponent {

  selectMedidoresRelacion:MedidorAsociado[]=[];
  medidorAsc:MedidorAsociado|null =null;
  planillasSelect:any=[];
  planillaSelected:PlanillaLecturas|null=null;
  titleLecturas='Debe seleccionar una año de gestion'
  loading:boolean=false;
  showLecturas:boolean=false;
  constructor(private usuarioFunciones:UsuarioFuncionesService,
    private readonly messageService: MessageService,){}
  ngOnInit(): void {
    this.usuarioFunciones.PlanillaLecturas.subscribe(res=>{
      this.planillaSelected=res;
      this.showLecturas=true;
      console.log(res);
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
      if(res.OK){
        this.selectMedidoresRelacion=res.data!;
      }
    })
  }
  obtenerMedidor(event:any){
    // console.log(event);
    this.showLecturas=false;
    this.usuarioFunciones.getMedidor(event.value).subscribe(res=>{
      // console.log(res);
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
}
