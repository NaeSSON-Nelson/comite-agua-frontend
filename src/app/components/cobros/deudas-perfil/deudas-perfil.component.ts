import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medidor, MultaServicio, Perfil } from 'src/app/interfaces';
import { CobrosService } from '../cobros.service';
import { TreeNode } from 'primeng/api';
import { ComprobantePorPago, GestionesPorCobrar } from 'src/app/interfaces/pagos-services.interface';

interface MultaTree{
  nroMedidor:string;
  gestiones:GestionTree[]
}
interface GestionTree{
  gestion:number;
  lecturas:number[]
}
@Component({
  selector: 'app-deudas-perfil',
  templateUrl: './deudas-perfil.component.html',
  styles: [
    `
    
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      width: 100%;
    }

    .footer-info {
      display: flex;
      align-items: center;
      color: #6b7280;
      margin-right:15%
    }

    .footer-actions {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    `
  ]
})
export class DeudasPerfilComponent {
  @Input()
  idPerfil!:number;
  @Input()
  visible:boolean=false;
  closable:boolean=true;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  perfil!:Perfil;
  medidoresDeudas:TreeNode<any> []=[];
  //comprobantesPagar:any[]=[];
  selectedNodes: any =null;
  loading:boolean=false;
  cols:any[]=[
    { field: 'name', header: 'Medidores de agua' },
    { field: 'gestion', header: 'Gestión' },
    { field: 'mesLectura', header: 'Mes lecturado' },
    { field: 'lectura', header: 'Lectura' },
    { field: 'consumo', header: 'Consumido' },
    { field: 'monto_view', header: 'Deudas por pagar' }
  ];
  colsMulta:any[]=[

    { field: 'field', header: '' ,colspan:1},
    { field: 'id', header: 'N° MULTA' ,colspan:1},
    { field: 'motivo', header: 'MOTIVO DE MULTA',colspan:3 },
    { field: 'monto', header: 'MONTO MONETARIO',colspan:1 },
    // { field: 'moneda', header: 'MONEDA',colspan:1 },
    // { field: 'pagado', header: 'Consumo' },
  ];
  constructor(private cobrosService:CobrosService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cobrosService.perfil.subscribe(res=>{
      this.perfil=res;
      console.log('PERFIL:',res);
      this.colorIndex=0;
      this.medidoresDeudas=res.afiliado!.medidorAsociado!.map((asc,i)=>{
        const {medidor,planillas}=asc
        const nodoMedidor:TreeNode<any> ={
          expanded:true,
          data:{
          name:medidor!.nroMedidor,
          gestion:null,
          mesLectura:null,
          lectura:null,
          consumo:null,
          monto:null,
          moneda:null,
          isMulta:false,
          },
          children:asc.planillas?.map((planilla,j)=>{
            const nodoPlanilla:TreeNode<any>={
              expanded:true,
              data:{
                name:null,
                gestion:planilla.gestion,
                mesLectura:null,
                lectura:null,
                consumo:null,
                monto:null,
                moneda:null,
                isMulta:false,
              },
              children:planilla.lecturas.map((lect,k,planillas)=>{
                
                const lecturaNode:TreeNode<any>={
                  expanded:true,
                  selectable:lect.isMulta?false:true,
                  data:{
                    name:null,
                    gestion:null, 
                    mesLectura:lect.PlanillaMesLecturar,
                    lectura:`${lect.lectura} ${lect.medicion}.`,
                    consumo:`${lect.consumoTotal} ${lect.medicion}.`,
                    monto:lect.pagar!.monto,
                    idComprobante:lect.pagar!.id,
                    moneda:`${lect.pagar?.moneda}`,
                    monto_view:`${lect.pagar?.monto} ${lect.pagar?.moneda}.`,
                    isMulta:lect.isMulta,
                    multa:lect.multa
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
      this.addMultasTreePagos();
      // console.log(this.medidoresDeudas);
    })
    this.obtenerComprobanteDetalles();
  }
  obtenerComprobanteDetalles(){
    this.loading=true;
    this.cobrosService.findOnePerfil(this.idPerfil).subscribe(res=>{
      // this.perfil=res;
      // console.log(res);
      if(res.OK){
        this.total=0;
      }
      this.loading=false;
    })
  }
  closeModalForm(event:boolean){
    this.closable=true;
    this.visiblePagar=false;
    this.obtenerComprobanteDetalles();
    // this.total=0;
  }
  total:number=0;
  visiblePagar:boolean=false;
  registrarDeudas(){
     
    // this.idPerfil=this.perfil!.id!;
    console.log(this.gestionesPorCobrar);
    this.visiblePagar=true;
    this.closable=false;
  }
  addSelect(event:any){
    this.addCobro(event.node)
  }
  dropSelected(event:any){
    this.reduceCobro(event.node);
  }
  gestionesPorCobrar:GestionesPorCobrar[]=[];
  addCobro(nodo:TreeNode<any>){
    if(!nodo.children){
      if(nodo.data.id){

        const gestionesSelected:{gestion:number,lecturas:TreeNode<any>[]}[]=[];
        for(const medidor of this.medidoresDeudas){
            const lt =medidor.children!.map(gest=>{
            return {
              gestion:gest.data.gestion,
              lecturas:gest.children!.filter(lect=> lect.data?.multa?.id === nodo.data.id)};
          })
          for(const ges of lt){
            if(ges.lecturas.length>0) gestionesSelected.push(ges);
          }
        }
        if(gestionesSelected.length>0){
          let lastGestion:GestionesPorCobrar|null=null;
          for(const gestion of gestionesSelected){
            for(const lectura of gestion.lecturas){
              const gestionInt = this.gestionesPorCobrar.find(res=>res.gestion === gestion.gestion);
            if(gestionInt){
              lastGestion=gestionInt;
              let compExit;
              this.gestionesPorCobrar.forEach(gest=>{
                gest.comprobantes.forEach(comp=>{
                  if(comp.idComprobante === lectura.data.idComprobante) compExit=comp;
                })
              })
              if(!compExit){
                gestionInt?.comprobantes.push(lectura.data);
                this.total=this.total+lectura.data.monto
              }
            }else{
              this.gestionesPorCobrar.push({
                gestion:gestion.gestion,
                comprobantes:[],
                multas:[],
              });
              const gestionInt = this.gestionesPorCobrar.find(res=>res.gestion === gestion.gestion);
              gestionInt?.comprobantes.push(lectura.data);
              this.total=this.total+lectura.data.monto
            }}
          }
          if(lastGestion){
            lastGestion.multas.push(nodo.data);
            this.total=this.total+Number.parseFloat(nodo.data.monto);
          }
        }
      }else if(!nodo.data.isMulta){
        const gestion = this.gestionesPorCobrar.find(gest=>gest.gestion === nodo.parent?.data.gestion);
        if(gestion){
          const compbExit = gestion.comprobantes.find(cmp=>cmp.idComprobante ===nodo.data.idComprobante);
          if(!compbExit){
            this.total=this.total+nodo.data.monto
            gestion.comprobantes.push(nodo.data)
          }  
        }else{
          this.gestionesPorCobrar.push({
            gestion:nodo.parent?.data.gestion,
            comprobantes:[],
            multas:[],
          })
          const gest = this.gestionesPorCobrar.find(gest=>gest.gestion === nodo.parent?.data.gestion);
          this.total=this.total+nodo.data.monto
          gest?.comprobantes.push(nodo.data)
        }
      }
    }else{
      for(const child of nodo.children){
        this.addCobro(child);
      }
    }
  }
  reduceCobro(nodo:TreeNode<any>){
    if(!nodo.children){
      if(nodo.data.id){
        const checkGestiones = [...this.gestionesPorCobrar];
        let k=0;
        for(const gestion of checkGestiones){
          let i=0;
          const lectu = this.gestionesPorCobrar[i].comprobantes.filter(lct=>{
            if(lct.multa?.id!==nodo.data.id){
              return true;
            }else{
              this.total=this.total-lct.monto
              return false
            }
          })
          if(lectu.length===gestion.comprobantes.length){
          }else if(lectu.length===0){
            this.gestionesPorCobrar[i].multas.forEach(mult=>{
              if(mult.id === nodo.data.id){
                this.total=this.total-Number.parseFloat(nodo.data.monto);
              }
            })
            this.gestionesPorCobrar.splice((i-k),1);
            k++;
          }else{
            this.gestionesPorCobrar[i].comprobantes=lectu;
            this.gestionesPorCobrar[i].multas=this.gestionesPorCobrar[i].multas.filter(mult=>{
              if(mult.id !== nodo.data.id){
                return true;
              }else{
                this.total=this.total-Number.parseFloat(nodo.data.monto);
                return false;
              }
            });
          }
          i++;
        }
      }else if(!nodo.data.isMulta){
        const gestion = this.gestionesPorCobrar.find(gest=>gest.gestion === nodo.parent?.data.gestion)!;
        
        if(gestion.comprobantes.length===1){
          const gestionIndex=this.gestionesPorCobrar.findIndex(gest=>gest.gestion === nodo.parent?.data.gestion);
          this.gestionesPorCobrar.splice(gestionIndex,1);
          this.total=0;
        }else{
          const comp = gestion.comprobantes.findIndex(compa=>compa.idComprobante=== nodo.data.idComprobante);
          if(comp>=0 && this.total>=0){
            gestion.comprobantes.splice(comp,1)
            this.total=this.total-nodo.data.monto
          }
        }
      }
    }else{
      for(const child of nodo.children){
        this.reduceCobro(child);
      }
    }
    
  }
  
  multaConcat:MultaServicio|null=null;
  medidoresTreeMultas:MultaTree[]=[];
  multaConcatArray:MultaServicio[]=[];
  addMultasTreePagos(){
    for(const medidor of this.medidoresDeudas){
      const medMulta:MultaTree={
        nroMedidor:medidor.data.name,
        gestiones:[]
      }
      for(let i=0;i< medidor.children!.length;i++){
        
        const lecturas:number[]=[];
        for(let j=0;j<medidor.children![i].children!.length;j++){
          if(medidor.children![i].children![j].data.isMulta){
            if(this.multaConcat){
              if(!(this.multaConcat.id === medidor.children![i].children![j].data.multa.id)){
                // gestion.children?.splice(i,0,{data:this.multaConcat,expanded:true,selectable:true})
                lecturas.push(j);
                this.multaConcatArray.push({...this.multaConcat,multaColor:this.addColorMulta()});
                this.multaConcat=null;
                this.colorIndex++;
              }
            }else{
              this.multaConcat=medidor.children![i].children![j].data.multa;
            }
          }else if(this.multaConcat){
            lecturas.push(j);
            this.multaConcatArray.push({...this.multaConcat,multaColor:this.addColorMulta()});
            this.colorIndex++;
            this.multaConcat=null;
          }
        }
        if(lecturas.length>0) {
          medMulta.gestiones?.push({
          gestion:medidor.children![i].data.gestion,
          lecturas
        })
      }
      }
      if(medMulta.gestiones?.length!>0){
        this.medidoresTreeMultas.push(medMulta);
      }
    }
    let indexMultas=0;
    let multasAdded=0;
    for(const med of this.medidoresTreeMultas){
      for(const gest of med.gestiones){
        for(const index of gest.lecturas){
          const result =this.medidoresDeudas.find(m=>m.data.name === med.nroMedidor)
                              ?.children?.find(g=>g.data.gestion === gest.gestion)
                              ?.children?.splice(index+multasAdded,0,{selectable:true,expanded:true,data:this.multaConcatArray[indexMultas]});
              // console.log('NODITO',result);
            indexMultas++;
            multasAdded++;
        }
        multasAdded=0;
      }
    }
    
  }
  checkMulta(rowData:any){
    if(rowData.isMulta){
      if(this.multaConcat){
        if(!(this.multaConcat.id === rowData.multa.id)){
          return true;
        }
      }else{
        this.multaConcat=rowData.multa
      }
    }
    return false  
  }
  colorIndex:number=0;
  mismaMulta:boolean=false;
  addColorMulta(){
    let color:string='';
    
    switch (this.colorIndex) {
      case 0:
        color= 'bg-blue-200';
        break;
        case 1:
        color='bg-green-200';
        break;
        case 2:
        color= 'bg-yellow-200';
        break;
        case 3:
          color= 'bg-cyan-200';
        break;
        case 4:
        color= 'bg-pink-200';
        break;
        case 5:
          color= 'bg-indigo-200';
        break;
          case 6:
            color= 'bg-teal-200';
        break;
            case 7:
        color= 'bg-orange-200';
        break;
        case 8:
        color= 'bg-bluegray-200';
        break;
        case 9:
        color= 'bg-purple-200';
        break;
      default:
        color= 'bg-red-200';
        break;
    }
    return color;
  }
}
