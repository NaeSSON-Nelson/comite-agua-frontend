import { Component } from '@angular/core';
import { AfiliadosService } from '../afiliados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';

@Component({
  selector: 'app-afiliado-details',
  templateUrl: './afiliado-details.component.html',
  styles: [],
})
export class AfiliadoDetailsComponent {
  constructor(
    private readonly afiliadoService: AfiliadosService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  afiliado!: Afiliado;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.afiliadoService.afiliado.subscribe((res) => {
      this.afiliado = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'CURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['afiliados']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.afiliadoService.findOne(id)))
        .subscribe({
          next: (res) => {
            if (!res.OK) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `OCURRIO UN ERROR AL OBTENER LA DATA: ${res.msg}`,
                life: 5000,
              });
              this.router.navigate(['afiliados']);
            }
          },
          error: (err) => {
            console.log('error', err);
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn Message',
              detail: `OCURRIO UN ERROR AL OBTENER LA DATA`,
              life: 5000,
            });
            this.router.navigate(['afiliados']);
          },
        });
    }
  }

  actionData(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate(['/afiliados/form'], {
          queryParams: { id: this.afiliado.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.afiliadoService
              .updateStatus(this.afiliado.id!, { estado: 0 })
              .subscribe({
                next: (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Se cambio con exito!',
                    detail: `${res.msg}`,
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

      case 'HABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Habilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.afiliadoService
              .updateStatus(this.afiliado.id!, { estado: 1 })
              .subscribe({
                next: (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Se cambio con exito!',
                    detail: `${res.msg}`,
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
}
