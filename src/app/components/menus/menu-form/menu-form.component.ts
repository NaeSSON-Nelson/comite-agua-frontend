import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemMenu, Menu, MenuForm, ItemToMenu } from 'src/app/interfaces/menu.interface';
import { MenusService } from '../menus.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { AsyncValidatorLinkService } from '../validators/async-validator-link.service';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_LISTAR, PATH_MENUS, PATH_MODULE_DETAILS } from 'src/app/interfaces/routes-app';

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
    
    this.menusService.menu.subscribe((res) => {
      // console.log(res);
      const { itemsMenu,created_at,updated_at,isActive, ...dataMenu } = res;
      this.menuActual = res;
      this.menuForm.setValue({
        ...dataMenu,
        itemsMenu:[]
      });
      // this.ListItemMenuSelected(itemsMenu!);
      this.addITemsSelect(itemsMenu!);
      // console.log(itemsMenu);
    });
    if (this.routerAct.snapshot.params['id'] && this.routerAct.snapshot.routeConfig?.path?.includes(PATH_EDIT)){
      this.menusService.findOne(this.routerAct.snapshot.params['id']).
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
              this.router.navigate([PATH_MENUS])
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
  menuForm: FormGroup = this.fb.group(
    {
      id: [],
      nombre:[,[Validators.required,Validators.pattern(patternText),Validators.minLength(2)]],
      linkMenu: [,[Validators.minLength(3),Validators.required,Validators.pattern(patternText),],],
      estado: [, [Validators.required]],
      itemsMenu: this.fb.array([], [Validators.required]),
    },
    {
      updateOn: 'blur',
      asyncValidators: [this.asyncValidators.validarLink('linkMenu', 'id')],
    }
  );
  visibles=[
    {name:'VISIBLE',value:true},
    {name:'NO VISIBLE',value:false},
  ]
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
    console.log('MENU FORM',this.menuForm);
    console.log('menu send',menuSend);
    // const { itemsMenu: dataItems, ...dataSend } = menuSend;
    this.registrarFormulario(menuSend);
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
                this.router.navigate([PATH_MENUS, PATH_MODULE_DETAILS], {
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
                this.router.navigate([PATH_MENUS,PATH_LISTAR]);
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

  // listItemsSelected: itemToMenu[] = [];
  showTableAsignModalForm: boolean = false;
  get itemsMenuForm() {
    return this.menuForm.controls['itemsMenu'] as FormArray;
  }
  listItemsSelected:ItemMenu[]=[];
  ListItemMenuSelected(list: ItemMenu[]) {
    this.itemsMenuForm.clear();
    this.listItemsSelected = list;
    // console.log(list);
    for (let item of list) {
      const itemsForm=this.fb.group({
        itemMenuId:[item.id,[Validators.required,Validators.min(1)]],
        nombre: [,[Validators.required,Validators.minLength(3),Validators.pattern(patternText),]],
        visible:[true],
      })
      // this.listItemsSelected.push(item);
      this.itemsMenuForm.push(itemsForm);
    }
    // this.closeTableModalForm(false);
  }
  addITemsSelect(list:ItemToMenu[]){
    this.listItemsSelected = list.map(val=>val.itemMenu!);
    // console.log('LISTA AGREGADA',list);
    for (let item of list) {
      const itemsForm=this.fb.group({
        itemMenuId:[item.itemMenu!.id,[Validators.required,Validators.min(1)]],
        nombre: [item.nombre,[Validators.required,Validators.minLength(3),Validators.pattern(patternText),]],
        visible:[true],
      })
      // this.listItemsSelected.push(item);
      this.itemsMenuForm.push(itemsForm);
    }
  }
  getItemLinkName(item:any){
    // console.log('ITEM FORM',item);
    // console.log('LISTA SELECTADA',this.listItemsSelected);
    return this.listItemsSelected.find(val=>val.id===item.itemMenuId)?.linkMenu;
  }
  closeTableModalForm(view: boolean) {
    this.showTableAsignModalForm = view;
  }
  deleteItemMenu(item: any) {
    console.log(item);
    console.log(this.listItemsSelected);
    const index = this.listItemsSelected.findIndex((val) => val.id === item.itemMenuId);
    // console.log(index);
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
  limpiarCampoArray(campo: string,index:number) {
    if (
      !this.itemsMenuForm.at(index).get(campo)?.pristine &&
      this.itemsMenuForm.at(index).get(campo)?.value?.length === 0
    ) {
      this.itemsMenuForm.at(index).get(campo)?.reset();
    }
  }
  campoValidoArray(nombre: string,index:number) {
    return (
      this.itemsMenuForm.at(index).get(nombre)?.errors &&
      this.itemsMenuForm.at(index).get(nombre)?.touched
    );
  }
  inputValidArray(nombre: string,index:number) {
    return this.itemsMenuForm.at(index).get(nombre)?.errors &&
      this.itemsMenuForm.at(index).get(nombre)?.touched
      ? 'ng-invalid ng-dirty'
      : this.itemsMenuForm.at(index).get(nombre)?.valid &&
        this.itemsMenuForm.at(index).get(nombre)?.touched
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

  getNombreItemErrors(campo:string,index:number){
    const errors = this.itemsMenuForm.at(index).get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    } 
    return '';
  }
  // getVisiblesArrayItem(campo:string,index:number){
  //   const errors = this.itemsMenuForm.at(index).get(campo)?.errors;


  // }
}
