import { Component } from '@angular/core';
import { RolesService } from '../roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role.interface';
import { Subscription, switchMap } from 'rxjs';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_REGISTRAR, PATH_ROLES, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styles: [
  ]
})
export class RoleDetailsComponent {
  constructor(
    private readonly rolesService: RolesService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  subscription!:Subscription;
  role!: Role;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscription=this.rolesService.role.subscribe((res) => {
      this.role = res;
      console.log('role data:',res);
    });
    if (!this.routerAct.snapshot.params['id']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA REFERENCIA',
        life: 5000,
      });
      this.router.navigate([ValidMenu.roles]);
      return;
    } else {
      const id =this.routerAct.snapshot.params['id']
      this.rolesService.findOne(id).subscribe({
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
                this.router.navigate([ValidMenu.roles])
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
        this.router.navigate([ValidMenu.roles,ValidItemMenu.rolUpdate,this.role.id]);
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.rolesService
              .updateStatus(this.role.id!, { estado: Estado.DESHABILITADO })
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

      case 'HABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Habilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.rolesService
              .updateStatus(this.role.id!, { estado: Estado.ACTIVO })
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
