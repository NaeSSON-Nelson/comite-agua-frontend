import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { Role } from 'src/app/interfaces/role.interface';
import { switchMap } from 'rxjs';
import { Usuario, UsuarioForm } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styles: [],
})
export class UsuarioFormComponent {
  constructor(
    private fb: FormBuilder,
    private readonly usuariosService: UsuariosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  afiliadoSelected?: Afiliado;
  listRolesSelected: Role[] = [];
  ngOnInit(): void {}

  showTableAsignAfiliadoModalForm: boolean = false;
  showModalTableAfiliados() {
    this.showTableAsignAfiliadoModalForm = true;
  }
  showTableAsignRoleModalForm: boolean = false;
  showModalTableRoles() {
    this.showTableAsignRoleModalForm = true;
  }
  usuarioForm: FormGroup = this.fb.group({
    afiliado: this.fb.group({
      id: [, [Validators.required, Validators.min(1)]],
    }),
    roles: this.fb.array([], [Validators.required]),
  });
  get rolesForm() {
    return this.usuarioForm.controls['roles'] as FormArray;
  }
  get afiliadoForm() {
    return this.usuarioForm.get('afiliado') as FormGroup;
  }

  ListItemMenuSelected(list: Role[]) {
    this.rolesForm.clear();
    this.listRolesSelected = [];
    for (let item of list) {
      // console.log(item);
      const itemForm = this.fb.group({
        id: [item.id, [Validators.required]],
      });
      this.listRolesSelected.push(item);
      this.rolesForm.push(itemForm);
    }
    this.closeTableRoleModalForm(false);
  }
  afiliadoSelectable(afiliado: Afiliado) {
    this.afiliadoSelected = afiliado;
    this.afiliadoForm.get('id')?.setValue(afiliado.id);

    this.showTableAsignAfiliadoModalForm = false;
  }
  deleteItemMenu(index: number) {
    this.rolesForm.removeAt(index);
    this.listRolesSelected.splice(index, 1);
  }
  deleteSelection() {
    this.rolesForm.clear();
    this.listRolesSelected = [];
  }
  closeTableRoleModalForm(view: boolean) {
    this.showTableAsignRoleModalForm = view;
  }
  closeTableAfiliadoModalForm(view: boolean) {
    this.showTableAsignAfiliadoModalForm = view;
  }
  validForm() {
    this.usuarioForm.markAllAsTouched();
    if (this.usuarioForm.invalid) return;
    // console.log(this.clienteForm.value);
    let usuarioSend: Usuario = {};
    usuarioSend = Object.assign({}, this.usuarioForm.value);
    Object.entries(usuarioSend).forEach(([key, value]) => {
      if (!value) delete usuarioSend[key as keyof Usuario];
    });
    const { roles: dataroles, ...dataSend } = usuarioSend;
    this.registrarFormulario({
      ...dataSend,
      roles: dataroles?.map((val) => val.id!),
    });
    // console.log({
    //   ...dataSend,
    //   roles: dataroles?.map((val) => val.id!),
    // });
  }
  registrarFormulario(form: UsuarioForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de asignar esta Cuenta al afiliado?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.usuariosService.create(form).subscribe({
          next: (res) => {
            console.log(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Registro Exitoso!',
              detail: res.msg,
              icon: 'pi pi-check',
            });
            
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ocurrió un error al asignar el usuario!!',
              detail: `Detalles del error: console`,
              life: 5000,
              icon: 'pi pi-times',
            });
            console.log(err);
          },
        });
      },
    });
  }
  limpiarCampo(campo: string) {
    if (
      !this.usuarioForm.get(campo)?.pristine &&
      this.usuarioForm.get(campo)?.value?.length === 0
    ) {
      this.usuarioForm.get(campo)?.reset();
    }
  }

  estados = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
  ];

  ///VALIDATORS

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
      : '';
  }

  //MESSAGES ERRORS TYPE

  getAfiliadoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'Es necesario asignar un Afiliado a la cuenta';
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
