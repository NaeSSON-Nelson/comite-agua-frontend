import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemMenu } from 'src/app/interfaces/menu.interface';
import { ItemsMenuService } from '../items-menu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { patternText } from 'src/app/patterns/forms-patterns';
import { AsyncValidatorLinkService } from '../validators/async-validator-link.service';

@Component({
  selector: 'app-item-menu-form',
  templateUrl: './item-menu-form.component.html',
  styles: [
  ]
})
export class ItemMenuFormComponent {
  itemMenuActual?: ItemMenu;
  blockSpace:RegExp=/[^\s]/;
  constructor(
    private fb: FormBuilder,
    private readonly itemsMenuService: ItemsMenuService,
    private asyncValidators: AsyncValidatorLinkService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private routerAct: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.itemsMenuService.itemMenu.subscribe(res=>{
      this.itemMenuForm.setValue(res);
      this.itemMenuActual = res;
    })
    if (!this.router.url.includes('id')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ id }) => this.itemsMenuService.findOne(id)))
      .subscribe(res => {
        if(res.OK)
        this.messageService.add({
          severity: 'success',
          summary: 'Cargado con exito',
          detail: `${res.msg}`,
          icon: 'pi pi-check',
        });
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Data no encontrada',
            detail: `${res.msg}`,
            icon: 'pi pi-times',
          });
          this.router.navigate(['menus','items']);
        }
      });
  }
  itemMenuForm: FormGroup = this.fb.group({
    id: [],
    nombre: [,[Validators.required,Validators.minLength(3),Validators.pattern(patternText)]],
    linkMenu: [,[Validators.minLength(3),Validators.required,Validators.pattern(patternText)]],
    estado: [1, [Validators.required]],
  },{
    asyncValidators:[this.asyncValidators.validarLink('linkMenu','id')],
    updateOn: 'blur',
  });
  validForm() {
    this.itemMenuForm.markAllAsTouched();
    // console.log(this.clienteForm.value);
    // console.log(this.itemMenuForm);
    if (this.itemMenuForm.invalid) return;
    let itemMenuSend: ItemMenu={}; 
    if(this.itemMenuActual){
      for(const [key,value ] of Object.entries(this.itemMenuForm.value)){
        if(value!==this.itemMenuActual[key as keyof ItemMenu]){
          itemMenuSend[key as keyof ItemMenu] = value as any;
        }
      }
    }else{
      itemMenuSend=Object.assign({}, this.itemMenuForm.value);
      Object.entries(itemMenuSend).forEach(([key, value]) => {
        if (!value) delete itemMenuSend[key as keyof ItemMenu];
      });
    }
    this.registrarFormulario(itemMenuSend);
    
    // console.log(itemMenuSend);
  }
  registrarFormulario(form:ItemMenu){
    this.confirmationService.confirm({
      message: `¿Está seguro de ${this.itemMenuActual?.id  ? 'actualizar este registro':'registrar este formulario'}?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept:()=>{
            if(this.itemMenuActual?.id){

              this.itemsMenuService.update(this.itemMenuActual.id,form).subscribe({
                next:(res)=>{

                  this.messageService.add({severity:'info',summary:'Se cambio con exito!', detail:`${res.msg}`,icon:'pi pi-check'})
                  this.router.navigate(['menus','items','details'],{queryParams:{id:this.itemMenuActual?.id}});
                },
                error:err=>{
                  this.messageService.add({severity:'error',summary:'Ocurrió un error al modificar el Empleado!!', detail:`Detalles del error: ???console`,life:5000, icon:'pi pi-times'})
                  console.log(err);
                },
                complete:()=>{
              
              }
            });
          }
            else
            this.itemsMenuService.create(form).subscribe({
              next: res=>{
                console.log(res);            
                this.messageService.add({severity:'success',summary:'Registro Exitoso!', detail:res.msg,icon:'pi pi-check'})
                this.router.navigate(['menus','items'],);
              },
              error: err=>{
                this.messageService.add({severity:'error',summary:'Ocurrió un error al registrar el Empleado!!', detail:`Detalles del error: console`,life:5000, icon:'pi pi-times'})
                console.log(err);
              },
              complete:()=>{
                this.itemMenuForm.reset();
              
              }
            })
          }
    })
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

  estados = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
  ];
  getNombreErrors(campo: string) {
    const errors = this.itemMenuForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }

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
