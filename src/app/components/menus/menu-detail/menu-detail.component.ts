import { Component } from '@angular/core';
import { MenusService } from '../menus.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/menu.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styles: [
  ]
})
export class MenuDetailComponent {
  constructor(
    private readonly menusService: MenusService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  menu!: Menu;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.menusService.menu.subscribe((res) => {
      this.menu = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['menus']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.menusService.findOne(id)))
        .subscribe({
          next: (res) => {
            if (!res.OK) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `OCURRIO UN ERROR AL OBTENER LA DATA: ${res.msg}`,
                life: 5000,
              });
              this.router.navigate(['menus']);
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
            this.router.navigate(['menus']);
          },
        });
    }
  }

  actionData(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate(['menus','form'], {
          queryParams: { id: this.menu.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.menusService
              .updateStatus(this.menu.id!, { estado: 0 })
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
            this.menusService
              .updateStatus(this.menu.id!, { estado: 1 })
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
