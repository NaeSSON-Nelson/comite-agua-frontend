import { Component } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { switchMap } from 'rxjs';
import { Medidor } from 'src/app/interfaces/medidor.interface';
import { Estado, Perfil } from 'src/app/interfaces';

@Component({
  selector: 'app-afiliado-medidores-details',
  templateUrl: './afiliado-medidores-details.component.html',
  styles: [
  ]
})
export class AfiliadoMedidoresDetailsComponent {
  constructor(
    private readonly medidoresService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  perfil!: Perfil;
  medidorSelected!: Medidor;
  planillaVisible:boolean=false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.medidoresService.afiliadoWithMedidores.subscribe((res) => {
      this.perfil = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['medidores-agua']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.medidoresService.findOne(id)))
        .subscribe({
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
                  this.router.navigate(['auth', 'login']);
                  break;
                case 403:
                  this.messageService.add({
                    severity: 'warn',
                    summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                    detail: `${res.message},code: ${res.statusCode}`,
                    life: 5000,
                  });
                  this.router.navigate(['forbidden']);
                  break;
                case 404:
                  this.messageService.add({
                    severity: 'warn',
                    summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                    detail: `${res.message},code: ${res.statusCode}`,
                    life: 5000,
                  });
                  this.router.navigate(['medidores-agua'])
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
          }
        });
    }
  }

  actionData(action: string) {
    if(!this.medidorSelected){
      this.messageService.add({
        severity: 'info',
        summary: 'Error',
        detail: `No ha seleccionado ningun medidor`,
        life: 1000,
      });
    }else
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate(['medidores-agua','medidor-agua-register'], {
          //TODO: DEBE SER EL ID DEL MEDIDOR
          queryParams: { idPerfil: this.perfil.id!,idMedidor:this.medidorSelected.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.medidoresService
              .updateStatus(this.medidorSelected.id!, { estado:Estado.DESHABILITADO })
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
                    summary: 'Ocurrió un error al modificar!!',
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
              .updateStatus(this.medidorSelected.id!, { estado: Estado.ACTIVO })
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
                    summary: 'Ocurrió un error al modificar!!',
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
  selectMedidor(data:any){
    this.medidorSelected=data.value;
  }
  registrarMedidor(){
    this.router.navigate(['medidores-agua','medidor-agua-register'],{queryParams:{idPerfil:this.perfil.id}})
  }
  showPlanillas(){
    this.planillaVisible=!this.planillaVisible;
  }
  cerrarPlanillas(evento:boolean){
    this.planillaVisible=evento;
  }
}
