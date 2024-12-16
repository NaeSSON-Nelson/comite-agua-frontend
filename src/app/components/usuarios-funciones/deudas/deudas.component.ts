import { Component } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { MultaServicio } from 'src/app/interfaces';
import { PlanillaLecturas } from 'src/app/interfaces/medidor.interface';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.component.html',
  styles: [
  ]
})
export class DeudasComponent {

  constructor(private usuarioFunciones:UsuarioFuncionesService){}
  selectMedidoresRelacion:any[]=[];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   this.getSelectsMedidores(); 
  }
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
  planillas:PlanillaLecturas[]=[];
  multas:MultaServicio[]=[];
  messageDeudas='';
  mostrarDeudas:boolean=false;
  obtenerMedidor(event:any){
    console.log(event);
    this.usuarioFunciones.getDeudasPendientes(event.value).subscribe(res=>{
      console.log(res);
      if(res.OK){
        this.planillas=res.data?.planillas ||[];
        this.multas = res.data?.multas ||[];
        this.mostrarDeudas=true;
        if(this.planillas.length===0 && this.multas.length ===0){
          this.messageDeudas='* NO TIENE DEUDAS PENDIENTES POR PAGAR'
        }
      }
    })
  }
}
