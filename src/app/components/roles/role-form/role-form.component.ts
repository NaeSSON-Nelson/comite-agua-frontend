import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleForm } from 'src/app/interfaces/role.interface';
import { RolesService } from '../roles.service';
import { AsyncValidatorRoleNameService } from '../validators/async-validator-role-name.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { Menu } from 'src/app/interfaces/menu.interface';
import { CommonAppService } from 'src/app/common/common-app.service';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_ROLES } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styles: [
  ]
})
export class RoleFormComponent {
  roleActual?: Role;
  constructor(
    private fb: FormBuilder,
    private readonly rolesService: RolesService,
    private asyncValidators: AsyncValidatorRoleNameService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonAppService:CommonAppService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rolesService.role.subscribe((res) => {
      console.log(res);
      const { menus,created_at,updated_at,isActive,estado, ...dataRole } = res;
      this.roleForm.removeControl('estado')
      this.listMenusSelected=menus!;
      this.ListMenuSelected(menus!);

      this.roleForm.setValue({
        ...dataRole,
        menus: menus?.map((val) => {
          return { id: val.id };
        }),
      });
      console.log('role form',this.roleForm.value);
      this.roleActual = res;
    });
    if (this.routerAct.snapshot.params['id'] && this.routerAct.snapshot.routeConfig?.path?.includes(PATH_EDIT)){
      // console.log('es edit');
      this.rolesService.findOne(this.routerAct.snapshot.params['id']).
      subscribe((res) => {
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
      })
  }
  }
  roleForm: FormGroup = this.fb.group(
    {
      id: [],
      nombre: [
        ,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(patternText),
        ],
      ],
      estado: [Estado.ACTIVO,[Validators.required]],
      nivel: [,[Validators.required]],
      menus: this.fb.array([], [Validators.required]),
    },
    {
      updateOn: 'blur',
      asyncValidators: [this.asyncValidators.validarNombre('nombre', 'id')],
    }
  );
  validForm() {
    this.roleForm.markAllAsTouched();
    if (this.roleForm.invalid) return;
    // console.log(this.clienteForm.value);
    let roleSend: Role = {};
    if (this.roleActual) {
      for (const [key, value] of Object.entries(this.roleForm.value)) {
        if (value !== this.roleActual[key as keyof Role]) {
          roleSend[key as keyof Role] = value as any;
        }
      }
    } else {
      roleSend = Object.assign({}, this.roleForm.value);
      Object.entries(roleSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete roleSend[key as keyof Role];
      });
    }
    // this.registrarFormulario(menuSend);
    console.log(roleSend);
    const { menus: dataItems, ...dataSend } = roleSend;
    this.registrarFormulario({
      ...dataSend,
      menus: dataItems?.map((val) => val.id!),
    });
  }
  registrarFormulario(form: RoleForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.roleActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.roleActual?.id) {
          this.rolesService.update(this.roleActual.id, form).subscribe({
            next: (res) => {
              if(res.OK){

                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_ROLES, PATH_MODULE_DETAILS,this.roleActual?.id]);
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: ???console ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res);

              }
            },
          });
        } else
          this.rolesService.create(form).subscribe({
            next: (res) => {
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_ROLES,PATH_LISTAR]);
              }else{
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

  listMenusSelected: Menu[] = [];
  showTableAsignModalForm: boolean = false;
  get menusForm() {
    return this.roleForm.controls['menus'] as FormArray;
  }

  ListMenuSelected(list: Menu[]) {
    this.menusForm.clear();
    this.listMenusSelected=list;
    for (let item of list) {
      const menu = this.fb.group({
        id: [item.id, [Validators.required]],
      });
      this.menusForm.push(menu);
    }
    // this.closeTableModalForm(false);
  }
  closeTableModalForm(view: boolean) {
    this.showTableAsignModalForm = view;
  }
  deleteItemMenu(id: number) {
    const index = this.listMenusSelected.findIndex((val) => val.id === id);
    this.menusForm.removeAt(id);
    this.listMenusSelected.splice(index, 1);
  }
  addItem() {
    this.showTableAsignModalForm = true;
  }
  limpiarCampo(campo: string) {
    if (
      !this.roleForm.get(campo)?.pristine &&
      this.roleForm.get(campo)?.value?.length === 0
    ) {
      this.roleForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.roleForm.controls[nombre].errors &&
      this.roleForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.roleForm.controls[nombre].errors &&
      this.roleForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.roleForm.controls[nombre].valid &&
        this.roleForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  estados = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
  ];
  getNombreErrors(campo: string) {
    const errors = this.roleForm.get(campo)?.errors;
    console.log(errors);
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    } else if (errors?.['exist']) {
      return 'Ya existe rol con el mismo nombre';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.roleForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getNivelErrors(campo: string) {
    const errors = this.roleForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }

  get formValid(){
    return this.roleForm.valid && this.roleForm.touched && !this.roleForm.pristine
  }
}
