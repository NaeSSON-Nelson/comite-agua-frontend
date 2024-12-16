import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfiguracionesService } from '../configuraciones.service';
import { TarifaPorConsumoAgua } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { PaginatorFind } from 'src/app/interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-tarifa-cobro-por-consumo',
  templateUrl: './tarifa-cobro-por-consumo.component.html',
  styles: [
  ]
})
export class TarifaCobroPorConsumoComponent {

  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  visibleForm:boolean=false;
  title='Tarifas de cobros por consumo de agua potable';
  data:TarifaPorConsumoAgua[]=[];
  tarifaSelected:TarifaPorConsumoAgua|null=null;
  titleResult='';
  constructor(
    private configuracionesService:ConfiguracionesService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
  ){}
  ngOnInit(): void {
    this.configuracionesService.tarifasPorConsumo.subscribe(res=>{
      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.size=res.size;
      this.data=res.data;
      console.log('data',res.data);
      if(this.data.length===0){
        this.titleResult='NO HAY TARIFAS DE COBROS DE CONSUMO DE AGUA REGISTRADOS'
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
    this.configuracionesService.findAllTarifasCobrosPorConsumo(this.dataPaginator).subscribe(res=>{
      if(res.OK){
      }
    })
  }
  actionData(tarifa:TarifaPorConsumoAgua) {
    // console.log(this.perfil);
    this.confirmationService.confirm({
      message: `¿Está seguro de ${tarifa.isActive?'deshabilitar':'habilitar'} la tarifa ?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.configuracionesService
          .updateStatusTarifasCobroPorConsumo(tarifa.id!)
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
  modificar(tarifa:TarifaPorConsumoAgua){
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
