import { Component } from '@angular/core';
import { RolesService } from '../roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role.interface';
import { switchMap } from 'rxjs';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_REGISTRAR, PATH_ROLES } from 'src/app/interfaces/routes-app';

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

  role!: Role;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.rolesService.role.subscribe((res) => {
      this.role = res;
      console.log(res);
    });
    if (!this.routerAct.snapshot.params['id']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA REFERENCIA',
        life: 5000,
      });
      this.router.navigate([PATH_ROLES]);
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
                this.router.navigate([PATH_ROLES])
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
        this.router.navigate([PATH_ROLES,PATH_REGISTRAR,PATH_EDIT,this.role.id]);
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
}
