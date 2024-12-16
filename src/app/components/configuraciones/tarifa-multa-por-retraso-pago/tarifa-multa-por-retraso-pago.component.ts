import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TarifaMultaPorRetrasosPagos } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { ConfiguracionesService } from '../configuraciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorFind } from 'src/app/interfaces';

@Component({
  selector: 'app-tarifa-multa-por-retraso-pago',
  templateUrl: './tarifa-multa-por-retraso-pago.component.html',
  styles: [
  ]
})
export class TarifaMultaPorRetrasoPagoComponent {

  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  visibleForm:boolean=false;
  title='Tarifas de multas por retrasos de pagos de servicio';
  data:TarifaMultaPorRetrasosPagos[]=[];
  tarifaSelected:TarifaMultaPorRetrasosPagos|null=null;
  titleResult='';
  constructor(
    private configuracionesService:ConfiguracionesService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
  ){}
  ngOnInit(): void {
    this.configuracionesService.tarifasMultasPorRetrasos.subscribe(res=>{
      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.size=res.size;
      this.data=res.data;
      console.log('data',res.data);
      if(this.data.length===0){
        this.titleResult='NO HAY TARIFAS DE MULTAS POR RETRASOS DE PAGOS DE SERVICIO'
      }else{
        this.titleResult='';
      }
    });
    this.obtenerTarifas();
  }
  dataPaginator: PaginatorFind = {
    offset:0,
    limit:10,
  };
  obtenerTarifas(){
    this.configuracionesService.findAllTarifasMultasPorRetrasoPago(this.dataPaginator).subscribe(res=>{
      if(res.OK){
      }
    })
  }
  actionData(tarifa:TarifaMultaPorRetrasosPagos) {
    // console.log(this.perfil);
    this.confirmationService.confirm({
      message: `¿Está seguro de ${tarifa.isActive?'deshabilitar':'habilitar'} la tarifa  de multa?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.configuracionesService
          .updateStatusTarifaMultaPorRetrasoPago(tarifa.id!)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Se cambio con exito!',
                detail: `${res.message}`,
                icon: 'pi pi-check',
              });
              this.obtenerTarifas();
            },
            error: (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al modificar!!',
                detail: `Detalles del error: ???console`,
                life: 5000,
                icon: 'pi pi-times',
              });
            },
          });
      },
    });
   
  }
  modificar(tarifa:TarifaMultaPorRetrasosPagos){
    this.tarifaSelected=tarifa;
    this.visibleForm=true;
  }
  loadCustomers(filters:any){

    this.dataPaginator.offset=filters.first
    this.dataPaginator.limit=filters.rows
    
    this.obtenerTarifas();
  }
  closeEventForm(visible:boolean){
    this.visibleForm=visible;
    this.tarifaSelected=null;
    this.obtenerTarifas();
  }
}
