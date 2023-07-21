import { Component } from '@angular/core';
import { ItemsMenuService } from '../items-menu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemMenu } from 'src/app/interfaces/menu.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-item-menu-details',
  templateUrl: './item-menu-details.component.html',
  styles: [
  ]
})
export class ItemMenuDetailsComponent {
  constructor(
    private readonly itemsMenuService: ItemsMenuService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  itemMenu!: ItemMenu;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.itemsMenuService.itemMenu.subscribe((res) => {
      this.itemMenu = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['menus','items']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.itemsMenuService.findOne(id)))
        .subscribe({
          next: (res) => {
            if (!res.OK) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `OCURRIO UN ERROR AL OBTENER LA DATA: ${res.msg}`,
                life: 5000,
              });
              this.router.navigate(['menus','items']);
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
            this.router.navigate(['menus','items']);
          },
        });
    }
  }

  actionData(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate(['menus','items','form'], {
          queryParams: { id: this.itemMenu.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.itemsMenuService
              .updateStatus(this.itemMenu.id!, { estado: 0 })
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
            this.itemsMenuService
              .updateStatus(this.itemMenu.id!, { estado: 1 })
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
