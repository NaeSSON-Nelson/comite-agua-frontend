import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilService } from '../perfil.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AfiliadoForm, Estado, Perfil, PerfilForm, ResponseCreatePerfil, Role, UsuarioForm } from 'src/app/interfaces';
import { patternCI, patternSpanishInline, patternText } from 'src/app/patterns/forms-patterns';
import { CommonAppService } from 'src/app/common/common-app.service';
import { switchMap } from 'rxjs';
import * as L from 'leaflet'
@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styles: [
  ]
})
export class PerfilFormComponent {
  constructor(
    private fb: FormBuilder,
    private readonly perfilService: PerfilService,
    private confirmationService: ConfirmationService,
    public commonServiceApp:CommonAppService,
    private messageService: MessageService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  perfilActual?: Perfil;
  listRolesSelected: Role[] = [];
  addAfiliado:boolean=false;
  addUsuario:boolean=false;
  showMap:boolean=false;
  ngOnInit(): void {
    this.perfilService.perfil.subscribe((res) => {
      const { usuario,afiliado,accessAcount,created_at,updated_at,id,isActive,contacto,tipoPerfil,...dataPerfil } = res;
      this.perfilActual=res;
        this.perfilForm.setValue({...dataPerfil,contacto});
    });
    if (!this.router.url.includes('id')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ id }) => this.perfilService.findOne(id)))
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
              this.router.navigate(['perfiles'])
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

  showTableAsignRoleModalForm: boolean = false;
  showModalTableRoles() {
    this.showTableAsignRoleModalForm = true;
  }
  perfilForm:FormGroup = this.fb.group({
    nombrePrimero:    [,[Validators.required,Validators.minLength(3),Validators.pattern(patternSpanishInline),],],
    nombreSegundo:    [,[Validators.minLength(3), Validators.pattern(patternSpanishInline)],],
    apellidoPrimero:  [,[Validators.required,Validators.minLength(3),Validators.pattern(patternSpanishInline),],],
    apellidoSegundo:  [,[Validators.minLength(3), Validators.pattern(patternSpanishInline)],],
    CI:               [,[Validators.required,Validators.minLength(6),Validators.pattern(patternCI),],],
    profesion:        [,[Validators.minLength(3), Validators.pattern(patternText),Validators.required]],
    direccion:        [,[Validators.pattern(patternText)]],
    genero:           [,[Validators.required, Validators.pattern(patternText)]],
    fechaNacimiento:  [,[Validators.required]],
    contacto:         ['+591 ',[Validators.pattern(/^\+[591]{3}\s[0-9]{6,8}$/gs)]],
    estado:           [Estado.ACTIVO,[Validators.required]],
  })

  afiliadoForm:FormGroup= this.fb.group({
    estado          :[Estado.ACTIVO,[Validators.required]],
    barrio          :[,[Validators.required]],
    numeroVivienda  :[,[Validators.pattern(patternText),Validators.minLength(3)]],
    longitud        :[],
    latitud         :[],
  })
  usuarioForm: FormGroup = this.fb.group({
    roles           :this.fb.array([], [Validators.required]),
    estado          :[Estado.ACTIVO,[Validators.required]],
    correo          :[,[Validators.email]]
  });
  get rolesForm() {
    return this.usuarioForm.controls['roles'] as FormArray;
  }
  addGroupDataAfiliado(event:any){
    console.log(event);
    if(event.value){
      this.perfilForm.addControl('afiliadoForm',this.afiliadoForm);
      this.addAfiliado=true;
    }else{
      this.perfilForm.removeControl('afiliadoForm');
      this.afiliadoForm.reset();
      this.addAfiliado=false;
    }
  }
  addGroupDataUsuario(event:any){
    console.log(event);
    if(event.value){
      this.perfilForm.addControl('usuarioForm',this.usuarioForm);
      this.addUsuario=true;
    }else{
      this.perfilForm.removeControl('usuarioForm');
      this.usuarioForm.reset();
      this.addUsuario=false;
    }
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
  deleteItemMenu(id: number) {
    // console.log(index);
    const index = this.listRolesSelected.findIndex(rol=>rol.id===id);
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
  validForm() {
    this.perfilForm.markAllAsTouched();
    if (this.perfilForm.invalid) return;
    // console.log(this.clienteForm.value);
    let perfilSend: PerfilForm = {};
    let afiliadoSend:AfiliadoForm={};
    let usuarioSend:UsuarioForm={};
    perfilSend = Object.assign({}, this.perfilForm.value);
    Object.entries(perfilSend).forEach(([key, value]) => {
      if (value === null || value ===undefined) delete perfilSend[key as keyof PerfilForm];
    });
    if(this.addAfiliado){
      afiliadoSend = Object.assign({}, this.afiliadoForm.value);
      Object.entries(afiliadoSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete afiliadoSend[key as keyof AfiliadoForm];
      });
      perfilSend.afiliadoForm=afiliadoSend;
    }
    if(this.addUsuario){
      usuarioSend = Object.assign({}, this.usuarioForm.value);
      Object.entries(usuarioSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete usuarioSend[key as keyof UsuarioForm];
      });
      usuarioSend.roles=(this.rolesForm.value as Array<any>).map(val=>val.id)
      perfilSend.usuarioForm=usuarioSend;
    }
    
    // console.log('formulario: ',this.perfilForm.value);
    // console.log('el enviado: ',perfilSend);
    this.registrarFormulario(perfilSend);
  }
  stateOptions: any[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false }
];
  public usuarioCreate:boolean=false;
  dataUser!:ResponseCreatePerfil;
  registrarFormulario(form: PerfilForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de Registrar?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if(this.perfilActual?.id){
          this.perfilService.update(this.perfilActual.id,form).subscribe({
            next:res=>{
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Actualizacion Exitosa!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.router.navigate(['perfiles','perfil-details'],{queryParams:{id:this.perfilActual!.id}});
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: ${res.message}`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(res.error,res.message);
              }
            }
          })
        }else
        this.perfilService.create(form).subscribe({
          next: (res) => {
            console.log(res);
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Registro Exitoso!',
                detail: res.message,
                icon: 'pi pi-check',
              });
              if(res.data?.dataUser.therePassword){
                this.dataUser=res.data;
                this.usuarioCreate=true;
              }else{
                this.router.navigate(['perfiles']);
              }
            }else{
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al registrar!!',
                detail: `Detalles del error: ${res.message}`,
                life: 5000,
                icon: 'pi pi-times',
              });
              console.log(res);
            }
          } 
        });
      },
    });
  }
  coordenadas($event:any){
    this.afiliadoForm.get('latitud')?.setValue($event.lat);
    this.afiliadoForm.get('longitud')?.setValue($event.lng);
  }
  get coordenadasLatLng(){
    return new L.LatLng(this.afiliadoForm.get('latitud')?.value ||-21.4734,this.afiliadoForm.get('longitud')?.value ||-64.8026);
  }
  cerrarMapa(modal:boolean){
    this.showMap=modal;
  }
  limpiarCampo(campo: string) {
    if (
      !this.perfilForm.get(campo)?.pristine &&
      this.perfilForm.get(campo)?.value?.length === 0
    ) {
      this.perfilForm.get(campo)?.reset();
    }
  }

  ///VALIDATORS PERFIL

  campoValido(nombre: string) {
    return (
      this.perfilForm.controls[nombre].errors &&
      this.perfilForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.perfilForm.controls[nombre].errors &&
      this.perfilForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  
  //VALIDATORS AFILIADO
  campoValidoAfiliado(nombre: string) {
    return (
      this.afiliadoForm.controls[nombre].errors &&
      this.afiliadoForm.controls[nombre].touched
    );
  }
  inputValidAfiliado(nombre: string) {
    return this.afiliadoForm.controls[nombre].errors &&
      this.afiliadoForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  //VALIDATORS USUARIO
  campoValidoUsuario(nombre: string) {
    return (
      this.usuarioForm.controls[nombre].errors &&
      this.usuarioForm.controls[nombre].touched
    );
  }
  inputValidUsuario(nombre: string) {
    return this.usuarioForm.controls[nombre].errors &&
      this.usuarioForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  campoValidRoles(){
    return this.rolesForm.errors !==null;
  }

   //MESSAGES ERRORS TYPE

   getNombrePrimeroErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }

  getNombreSegundoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }
  getPrimerApellidoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }
  getSegundoApellidoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }

  getCiErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    // console.log('errors', errors);
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 6 como minimo';
    } else if (errors?.['ciExist']) {
      return 'La Cedula de Identidad ingresado ya existe';
    }

    return '';
  }

  getFechaNacimientoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El formato debe fecha debe seguri el patron: dd/mm/yyyy';
    }
    return '';
  }
  getDireccionErrors(campo:string){
    const errors = this.perfilForm.get(campo)?.errors;
    if (errors?.['pattern']) {
      return 'El formato debe fecha debe seguri el patron: dd/mm/yyyy';
    }
    return '';

  }
  getProfesionErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño minimo debe ser 3';
    }
    return '';
  }
  getGeneroErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }



  getAfiliadoBarrioErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getAfiliadoNumeroViviendaErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño minimo debe ser 3';
    }
    return '';
  }
  getAfiliadoLongitudErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño minimo debe ser 3';
    }
    return '';
  }
  getAfiliadoLatitudErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño minimo debe ser 3';
    }
    return '';
  }
  getAfiliadoEstadoErrors(campo: string) {
    const errors = this.afiliadoForm.get(campo)?.errors;
    
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  
  getUsuarioCorreoErrors(campo:string){
    const errors = this.usuarioForm.get(campo)?.errors;
    if (errors?.['email']) {
      return 'El campo debe ser un correo: example@correo.com';
    }
    return'';
  }
  getUsuarioEstadoErrors(campo: string) {
    const errors = this.usuarioForm.get(campo)?.errors;
    
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getRolesErrors() {
    const errors = this.rolesForm.errors;
    if (errors?.['required']) {
      return 'debe asignar al menos un rol a la cuenta';
    }else if(this.rolesForm.length===0){
      return 'Debe asignar al menos un rol!';
    }
    return '';
  }
  getContactoErrors(campo:string) {
    const errors = this.perfilForm.get(campo)?.errors;
    if (errors?.['pattern']) {
      return 'Debe seguir el patron: +591 XXXXXXXX';
    }
    return '';
  }
}
