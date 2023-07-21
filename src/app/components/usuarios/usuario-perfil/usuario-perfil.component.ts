import { Component } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styles: [
  ]
})
export class UsuarioPerfilComponent {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  usuario!: Usuario;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.usuarioService.usuario.subscribe((res) => {
      this.usuario = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['usuarios']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.usuarioService.findOne(id)))
        .subscribe({
          next: (res) => {
            if (!res.OK) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `OCURRIO UN ERROR AL OBTENER LA DATA: ${res.msg}`,
                life: 5000,
              });
              this.router.navigate(['usuarios']);
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
            this.router.navigate(['usuarios']);
          },
        });
    }
  }

  actionData(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate(['usuarios','perfil','form'], {
          queryParams: { id: this.usuario.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.usuarioService
              .updateStatus(this.usuario.id!, { estado: 0 })
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
            this.usuarioService
              .updateStatus(this.usuario.id!, { estado: 1 })
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
  rolesAsign(){
    this.router.navigate(['usuarios','roles','form'],{queryParams:{id:this.usuario.id}});
  }
}
