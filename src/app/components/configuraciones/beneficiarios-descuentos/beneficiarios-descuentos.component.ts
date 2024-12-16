import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BeneficiarioDescuentos } from 'src/app/interfaces/opciones-confuguraciones.interface';
import { ConfiguracionesService } from '../configuraciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorFind } from 'src/app/interfaces';

@Component({
  selector: 'app-beneficiarios-descuentos',
  templateUrl: './beneficiarios-descuentos.component.html',
  styles: [
  ]
})
export class BeneficiariosDescuentosComponent {

  
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  visibleForm:boolean=false;
  title='Beneficiarios de descuentos en el pago del servicio de agua potable';
  data:BeneficiarioDescuentos[]=[];
  beneficiarioSelected:BeneficiarioDescuentos|null=null;
  titleResult='';
  constructor(
    private configuracionesService:ConfiguracionesService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
  ){}
  ngOnInit(): void {
    this.configuracionesService.beneficiarios.subscribe(res=>{
      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.size=res.size;
      // this.data=res.data;
      this.data=res.data;
      console.log('data',res.data);
      if(this.data.length===0){
        this.titleResult='NO HAY TARIFAS DE MULTAS POR RETRASOS DE PAGOS DE SERVICIO REGISTADOS'
      }else{
        this.titleResult='';
      }
    });
    this.obtenerBeneficiarios();
  }
  dataPaginator: PaginatorFind = {
    offset:0,
    limit:10,
  };
  obtenerBeneficiarios(){
    this.configuracionesService.findAllBeneficarios(this.dataPaginator).subscribe(res=>{
      if(res.OK){
      }
    })
  }
  actionData(beneficiario:BeneficiarioDescuentos) {
    // console.log(this.perfil);
    this.confirmationService.confirm({
      message: `¿Está seguro de ${beneficiario.isActive?'deshabilitar':'habilitar'} el tipo de beneficiario?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.configuracionesService
          .updateStatusBeneficiario(beneficiario.id!)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Se cambio con exito!',
                detail: `${res.message}`,
                icon: 'pi pi-check',
              });
              this.obtenerBeneficiarios();
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
  modificar(benificiario:BeneficiarioDescuentos){
    this.beneficiarioSelected=benificiario;
    this.visibleForm=true;
  }
  loadCustomers(filters:any){

    this.dataPaginator.offset=filters.first
    this.dataPaginator.limit=filters.rows
    
    this.obtenerBeneficiarios();
  }
  closeEventForm(visible:boolean){
    this.visibleForm=visible;
    this.beneficiarioSelected=null;
    this.obtenerBeneficiarios();
  }
}
