import { Component } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado, Perfil } from 'src/app/interfaces';
import { switchMap } from 'rxjs';
import { PATH_AFILIADO, PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_PERFILES, PATH_REGISTRAR, PATH_USER } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-perfil-details',
  templateUrl: './perfil-details.component.html',
  styles: [
  ]
})
export class PerfilDetailsComponent {
  constructor(
    private readonly perfilService: PerfilService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  perfil!: Perfil;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.perfilService.perfil.subscribe((res) => {
      this.perfil = res;
      console.log(res);
    });
    // console.log(this.router);
    // console.log(this.routerAct);
    // console.log(this.router);
    // console.log(this.routerAct.snapshot.params);
    if (!this.routerAct.snapshot.params['id']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA REFERENCIA',
        life: 5000,
      });
      this.router.navigate([PATH_PERFILES]);
      return;
    } else {
      const id =this.routerAct.snapshot.params['id']
        // .pipe(switchMap(({ id }) => this.perfilService.findOne(id)))
        // .subscribe({
        //   next: (res) => {
        //     if (res.OK === false) {
        //       switch (res.statusCode) {
        //         case 401:
        //           this.messageService.add({
        //             severity: 'info',
        //             summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
        //             detail: `${res.message},code: ${res.statusCode}`,
        //             life: 3000,
        //           });
        //           this.router.navigate([PATH_AUTH]);
        //           break;
        //         case 403:
        //           this.messageService.add({
        //             severity: 'warn',
        //             summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
        //             detail: `${res.message},code: ${res.statusCode}`,
        //             life: 5000,
        //           });
        //           this.router.navigate([PATH_FORBBIDEN]);
        //           break;
        //         case 404:
        //           this.messageService.add({
        //             severity: 'warn',
        //             summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
        //             detail: `${res.message},code: ${res.statusCode}`,
        //             life: 5000,
        //           });
        //           this.router.navigate([PATH_PERFILES])
        //           break;
        //         default:
        //           console.log(res);
        //           this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error no controlado',
        //             detail: 'revise la consola',
        //             life: 5000,
        //           });
        //           break;
        //       }
        //     }
        //   },
        // });
      this.perfilService.findOne(id).subscribe({
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
                this.router.navigate([PATH_PERFILES])
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
    // console.log(this.perfil);
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate([PATH_PERFILES, PATH_REGISTRAR,PATH_EDIT,this.perfil.id], {
          // queryParams: { id: this.perfil.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.perfilService
              .updateStatus(this.perfil.id!, { estado: Estado.DESHABILITADO })
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
                },
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
            this.perfilService
              .updateStatus(this.perfil.id!, { estado: Estado.ACTIVO })
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
                },
              });
          },
        });
        break;
        
        case 'AFILIADO':
              if(this.perfil.afiliado===null){
                this.router.navigate([PATH_PERFILES,PATH_AFILIADO, PATH_REGISTRAR,this.perfil.id], {
                  queryParams: { id: this.perfil.id }})
              }else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'El perfil ya tiene un afiliado',
                    life: 5000,
                    icon: 'pi pi-times',
                  });
              }
        break;
        case 'USUARIO':
          if(this.perfil.accessAcount === false){
            this.router.navigate([PATH_PERFILES,PATH_USER, PATH_REGISTRAR,this.perfil.id], {
              queryParams: { id: this.perfil.id },
            });
          }else{
            this.messageService.add({
              severity: 'error',
              summary: 'El perfil ya tiene un usuario',
              life: 5000,
              icon: 'pi pi-times',
            });
          }
          break;
      default:
        console.log('Opcion invalida');
        break;
    }
  }
  actionDataAfiliado(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate([PATH_PERFILES,PATH_AFILIADO, PATH_REGISTRAR,PATH_EDIT,this.perfil.id ], {
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar la afiliacion?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.perfilService
              .updateAfiliadoStatus(this.perfil.id!, { estado: Estado.DESHABILITADO })
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
                },
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
            this.perfilService
              .updateAfiliadoStatus(this.perfil.id!, { estado: Estado.ACTIVO })
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
                },
              });
          },
        });
        break;

      default:
        console.log('Opcion invalida');
        break;
    }
  }
  actionDataUsuario(action: string) {
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate([PATH_PERFILES,PATH_USER, PATH_REGISTRAR,PATH_EDIT,this.perfil.id], {
        });
        break;
      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.perfilService
              .updateUsuarioStatus(this.perfil.id!, { estado: Estado.DESHABILITADO })
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
                },
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
            this.perfilService
              .updateStatus(this.perfil.id!, { estado: Estado.ACTIVO })
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
                },
              });
          },
        });
        break;
      default:
        console.log('Opcion invalida');
        break;
    }
  }
  tipoPerfil(){
    let tipo:string='';
    if(this.perfil)
    this.perfil.tipoPerfil?.forEach(tip=>{
      tipo=`${tip}, ${tipo}`
    })
    return tipo;
  }
}
