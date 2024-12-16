import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role, RoleForm } from 'src/app/interfaces/role.interface';
import { RolesService } from '../roles.service';
import { AsyncValidatorRoleNameService } from '../validators/async-validator-role-name.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { Menu } from 'src/app/interfaces/menu.interface';
import { CommonAppService } from 'src/app/common/common-app.service';
import { Estado } from 'src/app/interfaces';
import { PATH_AUTH, PATH_EDIT, PATH_FORBBIDEN, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_ROLES, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';
import { Checkbox } from 'primeng/checkbox';

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
  subscribe!:Subscription;
  ngOnInit(): void {
    this.subscribe=this.rolesService.role.subscribe((res) => {
     
      const { menus,created_at,updated_at,isActive,estado, ...dataRole } = res;
      
      // console.log('role form',this.roleForm.value);
      this.roleActual = res;
      // this.listMenusSelected=menus!;
      // this.ListMenuSelected(menus!);
      console.log('role',res);
      this.roleForm.setValue({
        ...dataRole,
        menus:[],
        // menus: menus?.map((val) => {
        //   return this.fb.group({ id: val.id,name:val.nombre,selected:true })
        // }),
      });
      // console.log('ROLE FORM UPDATE BEFORE',this.roleForm);
      for(const menu of menus!){
        const item = this.fb.group({
          id:[menu.id],
          name:[menu.nombre],
          selected:[true],
        })
        this.menusFormArray.push(item);
      }
      // console.log('ROLE FORM UPDATE valor',this.menusFormArray);
      // console.log('ROLE FORM UPDATE',this.roleForm);
      //obtener menus para asignar a rol que tiene menus ya asignados
      this.rolesService.obtenerMenusForm().subscribe(res=>{
        if(res.OK){
          this.menusDisponibles=res.data!;
          this.menusDisponibles.forEach(menu=>{
            const control = this.menusFormArray.value.find((men:any)=>men.id === menu.id)
            // console.log('CONTROL ???',control);
            if(!control){
                const item =this.fb.group({
                  id:[menu.id],
                  name:[menu.nombre],
                  selected:[false]
                });
                this.menusFormArray.push(item);
              }
            
          });
          // console.log('array form select',this.menusFormArraySelect);
        }
      });


    });
    if (this.routerAct.snapshot.params['id'] && this.routerAct.snapshot.routeConfig?.path?.includes(ValidItemMenu.rolUpdate)){

      console.log('es edit');
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
              this.router.navigate([ValidMenu.roles])
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
    }else{
      //obtener menus para asignar a rol
      this.rolesService.obtenerMenusForm().subscribe(res=>{
        if(res.OK){
          this.menusDisponibles=res.data!;
          this.menusDisponibles.forEach(menu=>{
            this.menusFormArray.push(
              this.fb.group({
                id:[menu.id],
                name:[menu.nombre],
                selected:[false]
              })
            );
          });
          // console.log('array form select',this.menusFormArraySelect);
        }
      });
  }
  
  }
  cargarMenuForm(){
    for(const menu of this.menusDisponibles){
      const item = this.fb.group({
        selected:[false,Validators.required],
        label:[menu.nombre,Validators.required],
        id:[menu.id,Validators.required],
      })
      this.menusFormArray.push(item)
    }
    // console.log('form array for select',this.menusFormArray);
    // console.log('form array value',this.menusFormArray.value);
  }
  menusDisponibles:Menu[]=[];
  selectedMenus: Menu[] = [];
  // menusFormArraySelect:FormArray = this.fb.array([],[Validators.required])
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
      // estado: [Estado.ACTIVO,[Validators.required]],
      nivel: [,[Validators.required]],
      menus: this.fb.array([],[Validators.required]),
    },
    {
      updateOn: 'blur',
      asyncValidators: [this.asyncValidators.validarNombre('nombre', 'id')],
    }
  );
  validForm() {
    // console.log('form',this.roleForm);
    // console.log('form value',this.roleForm.value);
    // console.log('form array select',this.menusFormArraySelect);
    this.roleForm.markAllAsTouched();
    if (this.roleForm.invalid) return;
    // console.log(this.clienteForm.value);
    let roleSend: any = {};
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
    // console.log('roles send',roleSend);
    const { menus: dataItems, ...dataSend } = roleSend;
    this.registrarFormulario({
      ...dataSend,
      menus: dataItems!.filter((menu:any)=>menu.selected).map((re:any)=>re.id),
    });
  }
  getItems(id:number){
    return this.menusDisponibles.find(menu=>menu.id===id)?.itemMenu
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
                this.router.navigate([ValidMenu.roles,ValidItemMenu.rolDetails,this.roleActual?.id]);
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
                this.router.navigate([ValidMenu.roles,ValidItemMenu.rolList]);
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
  get menusFormArray() {
    return this.roleForm.controls['menus'] as FormArray;
  }
  get controlsForm(){
    return this.menusFormArray.controls as FormGroup[];
  }
  // onMenuSelectionChange(menu: any) {
  //   const isChecked = menu.get('selected').value;
  //   this.menusFormArray.controls
  //   if (isChecked) {
  //     this.selectedMenus.push(menu.value);
  //   } else {
  //     this.selectedMenus = this.selectedMenus.filter(
  //       m => m.id !== menu.get('id').value
  //     );
  //   }
  // }

  
  // Method to handle checkbox state changes
  toggleMenuAccess(menuId: number) {
    const menuAccess = this.roleForm.get('menus') as FormControl;
    const currentValue = menuAccess.value || [];
    
    const updatedValue = currentValue.includes(menuId)
      ? currentValue.filter((id: number) => id !== menuId)
      : [...currentValue, menuId];
    
    menuAccess.setValue(updatedValue);
  }

  onMenuSelectionChange(menu: any,index:number,checkboxForm:Checkbox) {
    // Update form control with selected menu IDs
    // console.log(menu);
    // console.log('template checkbox',checkboxForm);
    // console.log('trie value',
    //   checkboxForm.trueValue
    // );
    const menuFind=this.menusFormArray.value.find((men:any)=>men.id === menu.id);
    if(menuFind){
      this.menusFormArray.removeAt(index);
    }else{
      const item = this.fb.group({
        id:menu.id,
      })
      this.menusFormArray.push(item)
    }
  }
  @ViewChild('checkboxForm') checkbox:any;
  // ListMenuSelected(list: Menu[]) {
  //   this.menusForm.clear();
  //   this.listMenusSelected=list;
  //   for (let item of list) {
  //     const menu = this.fb.group({
  //       id: [item.id, [Validators.required]],
  //     });
  //     this.menusForm.push(menu);
  //   }
  //   // this.closeTableModalForm(false);
  // }
  // closeTableModalForm(view: boolean) {
  //   this.showTableAsignModalForm = view;
  // }
  // deleteItemMenu(id: number) {
  //   const index = this.listMenusSelected.findIndex((val) => val.id === id);
  //   this.menusForm.removeAt(id);
  //   this.listMenusSelected.splice(index, 1);
  // }
  // addItem() {
  //   this.showTableAsignModalForm = true;
  // }
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
 
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribe.unsubscribe();
  }
}
