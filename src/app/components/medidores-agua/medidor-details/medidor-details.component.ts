import { Component } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado, Medidor, MedidorAsociado } from 'src/app/interfaces';
import { PATH_AFILIADO, PATH_ASOCIACIONES, PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_MEDIDORES, PATH_MODULE_DETAILS, PATH_REGISTRAR, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-medidor-details',
  templateUrl: './medidor-details.component.html',
  styles: [
  ]
})
export class MedidorDetailsComponent {
  constructor(
    private readonly medidoresService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  medidor!:Medidor;
  ngOnInit(): void {
   this.medidoresService.medidor.subscribe(res=>{
    
    this.medidor=res;
    this.obtenerAsociaciones();
   })
   if (!this.routerAct.snapshot.params['id']) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn Message',
      detail: 'SE DEBE MANDAR UNA REFERENCIA',
      life: 5000,
    });
    this.router.navigate([PATH_MEDIDORES]);
    return;
  } else {
    const id =this.routerAct.snapshot.params['id']
      
    this.medidoresService.findOneMedidor(id).subscribe({
      next: (res) => {
        if (res.OK === false) {
          switch (res.statusCode) {
            case 401:
              this.messageService.add({
                severity: 'info',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 3000,
              });
              this.router.navigate([PATH_AUTH]);
              break;
            case 403:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate([PATH_FORBBIDEN]);
              break;
            case 404:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate([PATH_MEDIDORES])
              break;
            default:
              console.log(res);
              this.messageService.add({
                severity: 'error',
                summary: 'Error no controlado',
                detail: 'revise la consola',
                life: 5000,
              });
              break;
          }
        }
      },
    });
  }
  }
  actionData(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate([ValidMenu.medidores,ValidItemMenu.medidorUpdate,this.medidor.id]);
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.medidoresService
              .updateStatus(this.medidor.id!, { estado: Estado.DESHABILITADO })
              .subscribe({
                next: (res) => {
                  // console.log(res);
                  if(res.OK){
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Se cambio con exito!',
                      detail: `${res.message}`,
                      icon: 'pi pi-check',
                    });
                  }
                },
                error: (err) => {
                  console.log(err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al modificar !!',
                    detail: `Detalles del error: ???console`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                }
              });
          },
        });
        break;

      case 'HABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Habilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.medidoresService
              .updateStatus(this.medidor.id!, { estado: Estado.ACTIVO })
              .subscribe({
                next: (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Se cambio con exito!',
                    detail: `${res.message}`,
                    icon: 'pi pi-check',
                  });
                },
                error: (err) => {
                  console.log(err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al modificar el Empleado!!',
                    detail: `Detalles del error: ???console`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                }
              });
          },
        });
        break;

      default:
        console.log('Opcion invalida');
        break;
    }
  }
  detailAsociacion(){
    const afi = this.medidor.medidorAsociado?.find(res=>res.afiliado?.perfil?.id);
    // console.log('id perfil',id);
    if(afi)
    this.router.navigate([ValidMenu.asociaciones,ValidItemMenu.asociacionesAfiliadoDetails,afi.afiliado?.perfil?.id])
  }
  dataAsociados:MedidorAsociado[]=[];
  loadingAsociacion:boolean=false;
  asociacionTitle:string='';
  obtenerAsociaciones(){
    this.loadingAsociacion=true;
    this.asociacionTitle='';
    this.medidoresService.obtenerAsociacionesMedidor(this.medidor.id!).subscribe(res=>{
      if(res.OK){
        this.dataAsociados=res.data!;
        this.loadingAsociacion=false;
        if(res.data!.length===0)
        this.asociacionTitle='El medidor de agua no tiene asociaciones';
      }else{
        this.asociacionTitle='Error'
        this.loadingAsociacion=false;
      }
    })
  }
  visibleAsociacionDetails:boolean=false;
  idAsociado:number=-1;
  asociacionDetails(asociacion:MedidorAsociado){
    // console.log(asociacion);
    this.idAsociado=asociacion.id!;
    this.visibleAsociacionDetails=true;
  }
}
