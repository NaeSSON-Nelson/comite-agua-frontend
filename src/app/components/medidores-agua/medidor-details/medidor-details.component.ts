import { Component } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado, Medidor } from 'src/app/interfaces';
import { PATH_AFILIADO, PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_MEDIDORES, PATH_MODULE_DETAILS, PATH_REGISTRAR } from 'src/app/interfaces/routes-app';

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
    console.log('MEDIDOR: ',res);
    this.medidor=res;
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
        // console.log(res);
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
        this.router.navigate([PATH_MEDIDORES,PATH_REGISTRAR,PATH_EDIT,this.medidor.id]);
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
    const id = this.medidor.medidorAsociado?.map(val=>val.afiliado!.perfil!.id)
    console.log('id perfil',id);
    if(id?.length!>0)
    this.router.navigate([PATH_MEDIDORES,PATH_AFILIADO,PATH_MODULE_DETAILS,id![0]])
  }
}
