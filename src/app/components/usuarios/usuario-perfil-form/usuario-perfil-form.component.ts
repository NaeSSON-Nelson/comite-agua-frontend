import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../usuarios.service';
import { AsyncValidatorsProfileService } from '../validators/async-validators-profile.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil, Usuario } from 'src/app/interfaces/usuario.interface';
import { switchMap } from 'rxjs';
import { patterNumeroTelefonoBolivia, patternNumbers, patternText } from 'src/app/patterns/forms-patterns';

@Component({
  selector: 'app-usuario-perfil-form',
  templateUrl: './usuario-perfil-form.component.html',
  styles: [
  ]
})
export class UsuarioPerfilFormComponent {
  
  constructor(
    private fb: FormBuilder,
    private readonly usuariosService: UsuariosService,
    private readonly asyncValidatorsProfile: AsyncValidatorsProfileService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private routerAct: ActivatedRoute,
  ) {}
  perfilActual!:Perfil;
  usuarioActual!:Usuario;
  contactos:string[]=[];
  ngOnInit(): void {
    // if(this.clienteModificar?.id){
    //   this.proveedorForm.setValue(this.clienteModificar);
    // }
    // this.routerAct.paramMap.subscribe((params)=>{
    //   console.log(params);
    // })
    this.usuariosService.usuario.subscribe(res=>{
      // console.log(res);
      this.usuarioActual = res;
      // console.log(this.usuarioActual);
      this.perfilActual = res.perfil!;
      // console.log(res.perfil);
      const {latitud,longitud,profileImage,...dataPerfil} = res.perfil!;
      for(const ct of dataPerfil.contactos!){
        this.contactos.push(ct);
        this.contactosArrayForm.push(this.fb.nonNullable.control(ct));
      }
      this.perfilForm.setValue({...dataPerfil});
    })
    if (!this.router.url.includes('id')) return;

    this.routerAct.queryParams
      .pipe(switchMap(({ id }) => this.usuariosService.findOne(id)))
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
          this.router.navigate(['usuarios']);
        }
      });
  }

  perfilForm:FormGroup = this.fb.group({
    id:[],
    nombreUsuario:[,[Validators.minLength(2),Validators.pattern(patternText),Validators.required]],
    correo:[,[Validators.email]],
    codigoPostal:[,[Validators.minLength(4),Validators.pattern(patternNumbers)]],
    contactos:this.fb.array([]),
    direccion:[,[Validators.pattern(patternText),Validators.minLength(3)]],
    estado:[1,[Validators.min(0)]] 
  },{
    updateOn:'blur',
    asyncValidators:[this.asyncValidatorsProfile.validarEmail('correo','id'),this.asyncValidatorsProfile.validarPostalCode('codigoPostal','id')]
  })
  inputContactForm:FormGroup = this.fb.group({
    data:[,[Validators.required,Validators.minLength(10)]]
  })
  validForm() {
    this.perfilForm.markAllAsTouched();
    // console.log(this.afiliadoForm.errors);
    if (this.perfilForm.invalid) return;
    // console.log(this.clienteForm.value);
    let perfilSend: Perfil = {};
    if (this.perfilActual) {
      for (const [key, value] of Object.entries(this.perfilForm.value)) {
        console.log(key,value);
        if (value !== this.perfilActual[key as keyof Perfil] && value!=="") {
          perfilSend[key as keyof Perfil] = value as any;
        }
      }
    } else {
      perfilSend = Object.assign({}, this.perfilForm.value);
      Object.entries(perfilSend).forEach(([key, value]) => {
        if (value===null || value===undefined) delete perfilSend[key as keyof Perfil];
      });
    }
    this.registrarFormulario(perfilSend);
    // console.log(perfilSend);
  }

  registrarFormulario(perfilForm: Perfil) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.perfilActual?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
       
          this.usuariosService
            .updateProfile(this.usuarioActual.id!, perfilForm)
            .subscribe({
              next: (res) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.msg}`,
                  icon: 'pi pi-check',
                });
                this.router.navigate(['usuarios','perfil'],{queryParams:{id:this.usuarioActual?.id}});
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al modificar!!',
                  detail: `Detalles del error: ???console`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
                console.log(err);
              },
              complete: () => {
                
                this.perfilForm.reset();
              },
            });
      },
    });
  }
  get contactosArrayForm() {
    return this.perfilForm.get('contactos') as FormArray;
  }

  addContactForm() {

    // const control = this.fb.nonNullable.control(numero,[Validators.required]);
    this.inputContactForm.markAllAsTouched();
    console.log(this.inputContactForm);
    console.log(this.inputContactForm.invalid);
    if(this.inputContactForm.invalid) return;
    // const control=this.inputContactForm.get('data');
    const data = this.fb.nonNullable.control(this.inputContactForm.get('data')?.value);
    this.contactosArrayForm.push(data)
    this.contactos.push(data?.value);
    this.inputContactForm.reset();
  }

  deleteContact(contact:string){
    const index = this.contactos.findIndex(val=>val===contact);
    this.contactosArrayForm.removeAt(index);
    this.contactos.splice(index,1);
  }

  estados = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
  ];
  limpiarCampo(campo: string) {
    if (
      !this.perfilForm.get(campo)?.pristine &&
      this.perfilForm.get(campo)?.value?.length === 0
    ) {
      this.perfilForm.get(campo)?.reset();
    }
  }
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
      : this.perfilForm.controls[nombre].valid &&
        this.perfilForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  limpiarCampoInputNumeroForm(campo: string) {
    if (
      !this.inputContactForm.get(campo)?.pristine &&
      this.inputContactForm.get(campo)?.value?.length === 0
    ) {
      this.inputContactForm.get(campo)?.reset();
    }
  }
  campoValidoInputNumeroForm(nombre: string) {
    return (
      this.inputContactForm.controls[nombre].errors &&
      this.inputContactForm.controls[nombre].touched
    );
  }
  inputValidInputNumeroForm(nombre: string) {
    return this.inputContactForm.controls[nombre].errors &&
      this.inputContactForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.inputContactForm.controls[nombre].valid &&
        this.inputContactForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  getNombreUsuarioErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    if(errors?.['required']){
      return 'el campo es requerido'
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 2 como minimo';
    }
    return '';
  }
  getCorreoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    

    if (errors?.['email']) {
      return 'No es un correo';
    } else if (errors?.['exist']) {
      return 'El email ya existe';
    }
    return '';
  }
  getCodigoPostalErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;
    
    if (errors?.['minlength']) {
      return 'Minimo 4 caracteres';
    } else if (errors?.['pattern']) {
      return 'Solo numeros';
    } else if(errors?.['exist']){
      return 'El codigo ya existe'
    }
    return '';
  }

  getDireccionErrors(campo:string){
    const errors = this.perfilForm.get(campo)?.errors;
    if (errors?.['minlength']) {
      return 'Minimo 3 caracteres';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres no validos';
    } 
    return '';
  }
  getInputNumeroErrors(campo:string){
    const errors = this.inputContactForm.get(campo)?.errors;
    if(errors?.['required']){
      return' El campo es requerido'
    }else if (errors?.['minlength']) {
      return 'Minimo 10 caracteres';
    } 
    // else if (errors?.['pattern']) {
    //   return 'El patron: +591 ________';
    // } 
    return '';
  }
  getEstadoErrors(campo: string) {
    const errors = this.perfilForm.get(campo)?.errors;

    if (errors?.['min']) {
      return 'El minimo es 0: INACTIVO';
    }
    return '';
  }
}
