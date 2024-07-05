import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemMenu } from 'src/app/interfaces/menu.interface';
import { ItemsMenuService } from '../items-menu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { AsyncValidatorLinkService } from '../validators/async-validator-link.service';
import { CommonAppService } from 'src/app/common/common-app.service';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_ITEMSMENU, PATH_LISTAR, PATH_MODULE_DETAILS } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-item-menu-form',
  templateUrl: './item-menu-form.component.html',
  styles: [],
})
export class ItemMenuFormComponent {
  itemMenuActual?: ItemMenu;
  blockSpace: RegExp = /[^\s]/;
  constructor(
    private fb: FormBuilder,
    private readonly itemsMenuService: ItemsMenuService,
    private asyncValidators: AsyncValidatorLinkService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commonService: CommonAppService,
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
    this.itemsMenuService.itemMenu.subscribe((res) => {
      const { created_at, isActive, updated_at, ...dataItem } = res;
      this.itemMenuActual = res;
      this.itemMenuForm.setValue({ ...dataItem });
    });
    if (this.routerAct.snapshot.params['id'] && this.routerAct.snapshot.routeConfig?.path?.includes(PATH_EDIT)){
      // console.log('es edit');
      this.itemsMenuService.findOne(this.routerAct.snapshot.params['id']).
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
              this.router.navigate([PATH_ITEMSMENU])
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
  itemMenuForm: FormGroup = this.fb.group(
    {
      id: [],
      linkMenu: [,[Validators.minLength(3),Validators.required,Validators.pattern(patternText),],],
      estado: [Estado.ACTIVO, [Validators.required]],
    },
    {
      asyncValidators: [this.asyncValidators.validarLink('linkMenu', 'id')],
      updateOn: 'blur',
    }
  );
  validForm() {
    this.itemMenuForm.markAllAsTouched();
    // console.log(this.clienteForm.value);
    // console.log(this.itemMenuForm);
    if (this.itemMenuForm.invalid) return;
    let itemMenuSend: ItemMenu = {};
    if (this.itemMenuActual) {
      for (const [key, value] of Object.entries(this.itemMenuForm.value)) {
        if (value !== this.itemMenuActual[key as keyof ItemMenu]) {
          itemMenuSend[key as keyof ItemMenu] = value as any;
        }
      }
    } else {
      itemMenuSend = Object.assign({}, this.itemMenuForm.value);
      Object.entries(itemMenuSend).forEach(([key, value]) => {
        if (value === null || value === undefined)
          delete itemMenuSend[key as keyof ItemMenu];
      });
    }
    this.registrarFormulario(itemMenuSend);

    // console.log(itemMenuSend);
  }
  registrarFormulario(form: ItemMenu) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.itemMenuActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.itemMenuActual?.id) {
          this.itemsMenuService.update(this.itemMenuActual.id, form).subscribe({
            next: (res) => {
              if(res.OK){
                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_ITEMSMENU, PATH_MODULE_DETAILS], {
                  queryParams: { id: this.itemMenuActual?.id },
                });
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: console ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res);
              }
            }
          });
        } else
          this.itemsMenuService.create(form).subscribe({
            next: (res) => {
              if(res.OK){

                console.log(res);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.router.navigate([PATH_ITEMSMENU,PATH_LISTAR]);
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
  limpiarCampo(campo: string) {
    if (
      !this.itemMenuForm.get(campo)?.pristine &&
      this.itemMenuForm.get(campo)?.value?.length === 0
    ) {
      this.itemMenuForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.itemMenuForm.controls[nombre].errors &&
      this.itemMenuForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.itemMenuForm.controls[nombre].errors &&
      this.itemMenuForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.itemMenuForm.controls[nombre].valid &&
        this.itemMenuForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  estadoVisible = [
    { name: 'VISIBLE', value: true },
    { name: 'NO VISIBLE', value: false },
  ];

  getLinkMenuErrors(campo: string) {
    const errors = this.itemMenuForm.get(campo)?.errors;
    // console.log(errors);
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    } else if (errors?.['exist']) {
      return 'Ya existe un enlace con el mismo nombre';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.itemMenuForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
}
