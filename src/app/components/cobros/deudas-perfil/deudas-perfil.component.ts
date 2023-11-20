import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medidor, Perfil } from 'src/app/interfaces';
import { CobrosService } from '../cobros.service';
import { TreeNode } from 'primeng/api';
import { ComprobantePorPago } from 'src/app/interfaces/pagos-services.interface';

@Component({
  selector: 'app-deudas-perfil',
  templateUrl: './deudas-perfil.component.html',
  styles: [
  ]
})
export class DeudasPerfilComponent {
  @Input()
  idPerfil!:number;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  perfil:Perfil|null=null;
  medidoresDeudas:TreeNode<any> []=[];
  comprobantesPagar:any[]=[];
  selectedNodes: any =null;
  loading:boolean=false;
  cols:any[]=[
    { field: 'name', header: 'Nombres' },
    { field: 'mesLectura', header: 'Mes Lecturado' },
    { field: 'lectura', header: 'Lectura (m3.)' },
    { field: 'estadoMedidor', header: 'Estado medidor ' },
    { field: 'total', header: 'consumo (m3.)' },
    { field: 'monto', header: 'costo (Bs.)' },
    
  ]
  constructor(private cobrosService:CobrosService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cobrosService.perfil.subscribe(res=>{
      this.perfil=res;
      console.log(res);
      // if(res.afiliado?.medidores?.length>0)
      this.medidoresDeudas=res.afiliado!.medidores!.map(medidor=>{
        const {nroMedidor,marca,planillas}=medidor
        const nodoMedidor:TreeNode<any> ={
          expanded:true,
          data:{
          name:medidor.nroMedidor,
          mesLectura:'',
          lectura:'',
          estadoMedidor:'',
          total:'',
          monto:'',
          },
          children:medidor.planillas?.map(planilla=>{
            const nodoPlanilla:TreeNode<any>={
              expanded:true,
              data:{
                name:planilla.gestion,
                mesLectura:'',
                lectura:'',
                estadoMedidor:'',
                total:'',
                monto:'',
              },
              children:planilla.lecturas.map(lect=>{
                const lecturaNode:TreeNode<any>={
                  expanded:true,
                  selectable:true,
                  data:{
                    name:'', 
                    mesLectura:lect.mesLecturado,
                    lectura:lect.lectura,
                    total:lect.consumoTotal,
                    estadoMedidor:lect.estadoMedidor || 'SIN ESTADO REGISTRADO',
                    monto:lect.pagar!.monto,
                    idComprobante:lect.pagar!.id
                  }
                }
                return lecturaNode;
              })
            }
            return nodoPlanilla;
          })
        };
        return nodoMedidor;
      })
      // console.log(this.medidoresDeudas);
    })
    this.obtenerComprobanteDetalles();
  }
  obtenerComprobanteDetalles(){
    this.loading=true;
    this.cobrosService.findOnePerfil(this.idPerfil).subscribe(res=>{
      // this.perfil=res;
      console.log(res);
      if(res.OK){
      }
      this.loading=false;
    })
  }
  closeModalForm(event:boolean){
    this.visiblePagar=false;
    this.obtenerComprobanteDetalles();
    this.total=0;
  }
  total:number=0;
  visiblePagar:boolean=false;
  registrarDeudas(){
     
    // console.log(this.comprobantesPagar);
    // this.idPerfil=this.perfil!.id!;
    this.visiblePagar=true;
  }
  addSelect(event:any){
    // console.log(event);
    this.findCobro(event.node)
  }
  dropSelected(event:any){
    // console.log(event);
    this.reduceCobro(event.node);
  }
  findCobro(nodo:TreeNode<any>){
    if(!nodo.children){
      // console.log('es la data lectura',nodo.data);
      const compbExit = this.comprobantesPagar.find(cmp=>cmp.idComprobante ===nodo.data.idComprobante);
      if(!compbExit){
        this.total=this.total+nodo.data.monto
        this.comprobantesPagar.push(nodo.data)
      }
    }else{
      for(const child of nodo.children){
        this.findCobro(child);
      }
    }
  }
  reduceCobro(nodo:TreeNode<any>){
    if(!nodo.children){
      const comp = this.comprobantesPagar.findIndex(compa=>compa.idComprobante=== nodo.data.idComprobante);
      if(comp>=0){
        this.comprobantesPagar.splice(comp,1)
        this.total=this.total-nodo.data.monto
      }
    }else{
      for(const child of nodo.children){
        this.reduceCobro(child);
      }
    }
  }
}
