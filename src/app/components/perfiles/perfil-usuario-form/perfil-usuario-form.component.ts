import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Estado,
  Perfil,
  ResponseCreatePerfil,
  Role,
  UsuarioForm,
} from 'src/app/interfaces';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario-form',
  templateUrl: './perfil-usuario-form.component.html',
  styles: [],
})
export class PerfilUsuarioFormComponent {
  perfilActual?: Perfil;

  listRolesSelected: Role[] = [];
  constructor(
    private fb: FormBuilder,
    private readonly perfilService: PerfilService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonServiceApp: CommonAppService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.perfilService.perfil.subscribe((res) => {
      // console.log(res);
      const { usuario } = res;
      this.perfilActual = res;
      if (usuario) {
        console.log(usuario);
        const {
          correoVerify,
          created_at,
          id,
          isActive,
          password,
          roles,
          updated_at,
          username,
          ...dataUserForm
        } = usuario;
        const rolesForm = roles?.map((rol) => rol.id);
        this.usuarioForm.setValue({ roles: rolesForm, ...dataUserForm });
        this.ListItemMenuSelected(roles!);
      }
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['perfiles', 'perfil-list']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(
          switchMap(({ id }) => this.perfilService.findOnePerfilUsuario(id))
        )
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
                  this.router.navigate(['perfiles', 'perfil-list']);
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
  showTableAsignRoleModalForm: boolean = false;
  showModalTableRoles() {
    this.showTableAsignRoleModalForm = true;
  }
  usuarioForm: FormGroup = this.fb.group({
    roles: [, [Validators.required]],
    estado: [Estado.ACTIVO, [Validators.required]],
    correo: [, [Validators.email]],
  });
  validForm() {
    this.usuarioForm.markAllAsTouched();
    if (this.usuarioForm.invalid) return;
    // console.log(this.clienteForm.value);
    let usuarioSend: UsuarioForm = {};
    if (this.perfilActual?.usuario) {
      const { roles, estado, correo } = this.perfilActual.usuario;
      const usuarioFormSend: UsuarioForm = {
        estado,
        correo,
        roles: roles?.map((rol) => rol.id!),
      };
      for (const [key, value] of Object.entries(this.usuarioForm.value)) {
        if (value !== usuarioFormSend[key as keyof UsuarioForm]) {
          usuarioSend[key as keyof UsuarioForm] = value as any;
        }
      }
    } else {
      usuarioSend = Object.assign({}, this.usuarioForm.value);
      Object.entries(usuarioSend).forEach(([key, value]) => {
        if (value === null || value === undefined)
          delete usuarioSend[key as keyof UsuarioForm];
      });
    }
    this.registrarFormulario(usuarioSend);
    // console.log('form enviado',usuarioSend);
    // const { itemsMenu: dataItems, ...dataSend } = menuSend;
    // this.registrarFormulario({
    //   ...dataSend,
    //   itemsMenu: dataItems?.map((val) => val.id!),
    // });
  }
  public usuarioCreate: boolean = false;
  dataUser!: ResponseCreatePerfil;
  registrarFormulario(form: UsuarioForm) {
    console.log(form);
    this.confirmationService.confirm({
      message: `¿Está seguro de Registrar?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.perfilActual?.usuario) {
          this.perfilService
            .updateUsuario(this.perfilActual.id!, form)
            .subscribe({
              next: (res) => {
                if (res.OK) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizacion Exitosa!',
                    detail: res.message,
                    icon: 'pi pi-check',
                  });
                  this.router.navigate(['perfiles', 'perfil-details'], {
                    queryParams: { id: this.perfilActual!.id },
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al modificar!!',
                    detail: `Detalles del error: console${res.message}`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                  console.log(res);
                }
              },
            });
        } else
          this.perfilService
            .createUsuario(this.perfilActual?.id!, form)
            .subscribe({
              next: (res) => {
                if (res.OK) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Registro Exitoso!',
                    detail: res.message,
                    icon: 'pi pi-check',
                  });
                  if (res.data?.dataUser.therePassword) {
                    this.dataUser = res.data;
                    this.usuarioCreate = true;
                  } else {
                    this.router.navigate(['perfiles', 'perfil-details'], {
                      queryParams: { id: this.perfilActual!.id },
                    });
                  }
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al registrar!!',
                    detail: `Detalles del error: console ${res.message}`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                  console.log(res);
                }
              },
            });
      },
    });
  }
  ListItemMenuSelected(list: Role[]) {
    this.usuarioForm.get('roles')?.reset();
    this.listRolesSelected = [];
    this.usuarioForm.get('roles')?.setValue(
      list.map((role) => {
        this.listRolesSelected.push(role);
        return role.id;
      })
    );
    this.closeTableRoleModalForm(false);
  }
  deleteItemMenu(id: number) {
    // console.log(index);
    const index = this.listRolesSelected.findIndex((rol) => rol.id === id);
    const rolesNumber = this.usuarioForm.get('roles')?.value as Array<number>;
    rolesNumber.splice(index, 1);
    this.listRolesSelected.splice(index, 1);
  }
  deleteSelection() {
    this.usuarioForm.get('roles')?.reset();
    this.listRolesSelected = [];
  }
  closeTableRoleModalForm(view: boolean) {
    this.showTableAsignRoleModalForm = view;
  }

  limpiarCampo(campo: string) {
    if (
      !this.usuarioForm.get(campo)?.pristine &&
      this.usuarioForm.get(campo)?.value?.length === 0
    ) {
      this.usuarioForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.usuarioForm.controls[nombre].errors &&
      this.usuarioForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.usuarioForm.controls[nombre].errors &&
      this.usuarioForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.usuarioForm.controls[nombre].valid &&
        this.usuarioForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  getUsuarioCorreoErrors(campo: string) {
    const errors = this.usuarioForm.get(campo)?.errors;
    if (errors?.['email']) {
      return 'El campo debe ser un correo: example@correo.com';
    }
    return '';
  }
  getUsuarioEstadoErrors(campo: string) {
    const errors = this.usuarioForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getRolesErrors(campo: string) {
    const errors = this.usuarioForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'debe asignar al menos un rol a la cuenta';
    }
    return '';
  }
}
