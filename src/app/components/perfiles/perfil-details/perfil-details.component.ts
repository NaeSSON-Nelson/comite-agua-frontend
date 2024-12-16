import { Component } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado, Perfil } from 'src/app/interfaces';
import { Subscription, switchMap } from 'rxjs';
import { PATH_AFILIADO, PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_PERFILES, PATH_REGISTRAR, PATH_USER, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
@Component({
  selector: 'app-perfil-details',
  templateUrl: './perfil-details.component.html',
  styles: [`
    .button-camera-position{
      position: absolute;
      margin-top: 200px;
      margin-left: 168px;
    }
    `
  ]
})
export class PerfilDetailsComponent {
  constructor(
    private readonly perfilService: PerfilService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute,
  ) {}

  perfil!: Perfil;
  ngOnInit(): void {
    this.subscription=this.perfilService.perfil.subscribe((res) => {
      console.log('perfil',res);
      this.perfil = res;
    });
    if (!this.routerAct.snapshot.params['id']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA REFERENCIA',
        life: 5000,
      });
      this.router.navigate([ValidMenu.perfiles]);
      return;
    } else {
      this.findPerfil();
    }
  }

  actionData(action: string) {
    // console.log(this.perfil);
    switch (action) {
      case 'MODIFICAR':
        this.router.navigate([ValidMenu.perfiles, ValidItemMenu.perfilUpdate,this.perfil.id], {
          // queryParams: { id: this.perfil.id },
        });
        break;

      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar el perfil?`,
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
          message: `¿Está seguro de Habilitar el perfil?`,
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
                this.router.navigate([ValidMenu.perfiles,ValidItemMenu.perfilAfiliadoRegister,this.perfil.id], {
                  // queryParams: { id: this.perfil.id }
                })
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
            this.router.navigate([ValidMenu.perfiles,ValidItemMenu.perfilUserRegister,this.perfil.id], {
              // queryParams: { id: this.perfil.id },
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
        this.router.navigate([ValidMenu.perfiles,ValidItemMenu.perfilAfiliadoUpdate,this.perfil.id ], {
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
        this.router.navigate([ValidMenu.perfiles,ValidItemMenu.perfilUserUpdate,this.perfil.id], {
        });
        break;
      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar el usuario?`,
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
          message: `¿Está seguro de Habilitar el usuario?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.perfilService
              .updateUsuarioStatus(this.perfil.id!, { estado: Estado.ACTIVO })
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
  visibleImageForm:boolean=false;
  IsLoading:boolean=false;
  imageUpload:File[]=[]
  findPerfil(){
    const id =this.routerAct.snapshot.params['id']
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
  submitImage(event:any){
    // console.log('archivaso',event);
    // console.log('image upload',this.imageUpload);
    this.IsLoading=true;
    this.perfilService.uploadImageProfile(event.files[0],this.perfil.id!).subscribe(res=>{
      // console.log(res);
      if(res){
        this.messageService.add({
          severity: 'success',
          summary: `Imagen cambiada con exito`,
          detail: `${res.message}`,
          life: 3000,
        });
        this.IsLoading=false;
        this.visibleImageForm=false;
        this.findPerfil();
      }
    });
  }
  subscription!:Subscription;
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  visibleMapAfiliado:boolean=false;
  get coordenadasLatLng(){
    return new L.LatLng(this.perfil!.afiliado!.ubicacion!.latitud,this.perfil!.afiliado!.ubicacion!.longitud);
  }
  mostrarMapAfiliado(){
    console.log(this.perfil);
    if(this.perfil?.afiliado?.ubicacion?.longitud && this.perfil?.afiliado?.ubicacion?.latitud){
      this.visibleMapAfiliado=true;
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'No se proporcionó los datos de georreferenciación',
        life: 5000,
      });
    }
  }
  visiblePagoAfiliacion:boolean=false;

  mostrarBeneficiarios(){
    let beneficiarios='';
    if(this.perfil.afiliado!.descuentos){
      for(const beneficio of this.perfil.afiliado!.descuentos){
        beneficiarios=beneficiarios.concat(`${beneficio.tipoBeneficiario} ${beneficio.descuento}% de descuento\n`)
      }
    }
    return beneficiarios;
  }
}
