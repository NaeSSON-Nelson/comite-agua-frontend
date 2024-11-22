import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { MedidorAsociado } from 'src/app/interfaces';
import { Monedas } from 'src/app/interfaces/atributes.enum';
import { PlanillaLecturas } from '../../../interfaces/medidor.interface';


interface planillaNode{
  gestion?:            number;
  mesLectura?:         string;
  lectura?:            number;
  consumoTotal?:       number;
  estadoComprobante?:  string;
  fechaLimitePago?:    Date;
  diasRetraso?:        number;
  cantidad?:           string;
  motivo?:             string;
}
@Component({
  selector: 'app-form-multas-lecturas-select',
  templateUrl: './form-multas-lecturas-select.component.html',
  styles: [
  ]
})
export class FormMultasLecturasSelectComponent {

  @Input()
  visible:boolean=false;
  @Input()
  perfilId:number=-1;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerMedidoresSelect();
  }
  medidoresList:MedidorAsociado[]=[];
  medidorSelect!:MedidorAsociado;
  lecturasSelects:any[]=[];
  planillastreeNode:TreeNode<planillaNode>[]=[]
  cols:any[]=[
    { field: 'gestion', header: 'GESTION' },
    { field: 'mesLectura', header: 'MES' },
    { field: 'lectura', header: 'LECTURA REGISTRADA' },
    { field: 'consumoTotal', header: 'CONSUMO EN MEDIDA' },
    { field: 'estadoComprobante', header: 'ESTADO DEL PAGO' },
    { field: 'fechaLimitePago', header: 'Fecha limite de pago' },
    { field: 'diasRetraso', header: 'Total dias de retraso' },
    { field: 'cantidad', header: 'Monto de Tarifa' },
    { field: 'motivo', header: 'Motivo de Tarifa' },
    
  ]
  obtenerMedidoresSelect(){
    if(this.perfilId>0){
      this.cobrosService.obtenerMedidoresAsociadosSelect(this.perfilId).subscribe(res=>{
        // console.log(res);
        if(res.OK){
          this.medidoresList=res.data!;
          // console.log('medidores list',this.medidoresList);
        }
      });
    }else{
      this.messageService.add({ severity: 'warn', summary: 'ERROR EN OBTENER PERFIL', detail: `El id de perfil es invalido`,life:7500 });
    }
    
  }
  selectMedidor(event:any){
    // console.log(event);
    this.asociadoId=event.value;
    this.obtenerLecturas();
  }
  asociadoId:number=-1;
  obtenerLecturas(){
      this.cobrosService.obtenerLecturasConRetrasoPago(this.perfilId,this.asociadoId).subscribe(res=>{
        if(res.OK)
        this.planillastreeNode=this.TreeStructured(res.data!.planillas!);
      console.log('res',res.data);
      });
  }

  TreeStructured(planillas:PlanillaLecturas[]){
    return planillas.map(gest=>{
      const {gestion,lecturas}=gest
      const nodoMedidor:TreeNode<planillaNode> ={
        expanded:true,
        data:{
          gestion
        },
        children:lecturas.map(lect=>{
          const fechaLimite=new Date(lect.pagar!.fechaLimitePago)
          const nodoLectura:TreeNode<planillaNode>={
            expanded:true,
            data:{
            gestionD:gestion,
            mesLectura:lect.PlanillaMesLecturar,
            lectura:`${lect.lectura} ${lect.medicion}`,
            consumoTotal:`${lect.consumoTotal} ${lect.medicion}`,
            estadoComprobante:lect.pagar?.estadoComprobate,
            fechaLimitePago:`${fechaLimite.getDate()}/${fechaLimite.getMonth()+1}/${fechaLimite.getFullYear()}`,
            diasRetraso:`${this.diasRetraso(fechaLimite)} dias`,
            cantidad:`${lect.pagar?.monto} ${lect.pagar?.moneda}`,
            motivo:lect.pagar?.motivo,
            lecturaId:lect.id
            }
          }
          return nodoLectura
        })
      };
      return nodoMedidor;
    })
  }
  addSelect(eveny:any){
    this.addLecturaMulta(eveny.node);
  }

  dropSelect(eveny:any){
    this.reduceLecturaMulta(eveny.node);
  }
  addLecturaMulta(nodo:TreeNode<any>){
    // console.log('NODO',nodo);
    if(!nodo.children){
      if(!this.lecturasSelects.includes(nodo.data))
      this.lecturasSelects.push(nodo.data);
    }else{
      for(const child of nodo.children){
        this.addLecturaMulta(child);
      }
    }
  }
  reduceLecturaMulta(nodo:TreeNode<any>){
    // console.log('NODO',nodo);
    if(!nodo.children){
      const lct = this.lecturasSelects.findIndex(res=>res.lecturaId ===nodo.data.lecturaId);
      if(lct) this.lecturasSelects.splice(lct,1);
    }else{
      for(const child of nodo.children){
        this.reduceLecturaMulta(child);
      }
    }
  }
  diasRetraso(fechaLimite:Date){
    const dateActual = new Date();
    const dias = dateActual.getTime()-fechaLimite.getTime();
    return Math.trunc((Math.round((dias*(1.1574*Math.pow(10,-8)))*100)/100))
  }

  subirLecturas(){
    if(this.lecturasSelects.length>=3 && this.lecturasSelects.length<=5){
      this.eventLecturasSend.emit({lecturas:this.lecturasSelects,asociadoId:this.asociadoId})
      // console.log(this.lecturasSelects);
      this.eventVisible.emit(false);
      this.visible=false;
    }else{
      this.messageService.add({ severity: 'warn', summary: 'ERROR AL ENVIAR LOS DATOS', detail: `Minimo 3 lecturas para enviar y 5 como máximo`,life:5000 });
    }
  }
  @Output()
  eventLecturasSend:EventEmitter<any> = new EventEmitter<any>();
}
