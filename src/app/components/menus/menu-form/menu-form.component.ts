import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemMenu, Menu, MenuForm } from 'src/app/interfaces/menu.interface';
import { MenusService } from '../menus.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { AsyncValidatorLinkService } from '../validators/async-validator-link.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styles: [],
})
export class MenuFormComponent {
  menuActual?: Menu;
  blockSpace: RegExp = /[^\s]/;
  constructor(
    private fb: FormBuilder,
    private readonly menusService: MenusService,
    private asyncValidators: AsyncValidatorLinkService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
    this.menusService.menu.subscribe((res) => {
      // console.log(res);
      const { itemsMenu,created_at,updated_at,isActive, ...dataMenu } = res;
      this.listItemsSelected=itemsMenu!;
      this.ListItemMenuSelected(itemsMenu!);

      this.menuForm.setValue({
        ...dataMenu,
        itemsMenu: itemsMenu?.map((val) => {
          return { id: val.id };
        }),
      });
      this.menuActual = res;
    });
    if (!this.router.url.includes('id')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ id }) => this.menusService.findOne(id)))
      .subscribe((res) => {
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
              this.router.navigate(['menus'])
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
      });
  }
  menuForm: FormGroup = this.fb.group(
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
      linkMenu: [
        ,
        [
          Validators.minLength(3),
          Validators.required,
          Validators.pattern(patternText),
        ],
      ],
      estado: [1, [Validators.required]],
      itemsMenu: this.fb.array([], [Validators.required]),
    },
    {
      updateOn: 'blur',
      asyncValidators: [this.asyncValidators.validarLink('linkMenu', 'id')],
    }
  );
  validForm() {
    this.menuForm.markAllAsTouched();
    if (this.menuForm.invalid) return;
    // console.log(this.clienteForm.value);
    let menuSend: Menu = {};
    if (this.menuActual) {
      for (const [key, value] of Object.entries(this.menuForm.value)) {
        if (value !== this.menuActual[key as keyof Menu]) {
          menuSend[key as keyof Menu] = value as any;
        }
      }
    } else {
      menuSend = Object.assign({}, this.menuForm.value);
      Object.entries(menuSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete menuSend[key as keyof Menu];
      });
    }
    // this.registrarFormulario(menuSend);
    console.log(menuSend);
    const { itemsMenu: dataItems, ...dataSend } = menuSend;
    this.registrarFormulario({
      ...dataSend,
      itemsMenu: dataItems?.map((val) => val.id!),
    });
  }
  registrarFormulario(form: MenuForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.menuActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.menuActual?.id) {
          this.menusService.update(this.menuActual.id, form).subscribe({
            next: (res) => {
              if(res.OK){

                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate(['menus', 'menu-details'], {
                  queryParams: { id: this.menuActual?.id },
                });
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar el Empleado!!',
                  detail: `Detalles del error: ???console ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res);
              }
            },
          });
        } else
          this.menusService.create(form).subscribe({
            next: (res) => {
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.router.navigate(['menus','menu-list']);
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al registrar !!',
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

  listItemsSelected: ItemMenu[] = [];
  showTableAsignModalForm: boolean = false;
  get itemsMenuForm() {
    return this.menuForm.controls['itemsMenu'] as FormArray;
  }

  ListItemMenuSelected(list: ItemMenu[]) {
    this.itemsMenuForm.clear();
    this.listItemsSelected = [];
    for (let item of list) {
      const itemMenu = this.fb.group({
        id: [item.id, [Validators.required]],
      });
      this.listItemsSelected.push(item);
      this.itemsMenuForm.push(itemMenu);
    }
    // this.closeTableModalForm(false);
  }
  closeTableModalForm(view: boolean) {
    this.showTableAsignModalForm = view;
  }
  deleteItemMenu(id: number) {
    const index = this.listItemsSelected.findIndex((val) => val.id === id);
    this.itemsMenuForm.removeAt(index);
    this.listItemsSelected.splice(index, 1);
  }
  addItem() {
    this.showTableAsignModalForm = true;
  }
  limpiarCampo(campo: string) {
    if (
      !this.menuForm.get(campo)?.pristine &&
      this.menuForm.get(campo)?.value?.length === 0
    ) {
      this.menuForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.menuForm.controls[nombre].errors &&
      this.menuForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.menuForm.controls[nombre].errors &&
      this.menuForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.menuForm.controls[nombre].valid &&
        this.menuForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  estados = [
    { name: 'Activo', value: 'ACTIVO' },
    { name: 'Inactivo', value: 'INACTIVO' },
  ];
  getNombreErrors(campo: string) {
    const errors = this.menuForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    } else if (errors?.['exist']) {
      return 'Ya existe un enlace con el mismo nombre';
    }
    return '';
  }

  getLinkMenuErrors(campo: string) {
    const errors = this.menuForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.menuForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
}
