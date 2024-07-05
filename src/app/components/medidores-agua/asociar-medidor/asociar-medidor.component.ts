import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Estado, Medidor, MedidorAsociado, MedidorAsociadoForm, Perfil } from 'src/app/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonAppService } from 'src/app/common/common-app.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
@Component({
  selector: 'app-asociar-medidor',
  templateUrl: './asociar-medidor.component.html',
  styles: [
  ]
})
export class AsociarMedidorComponent {

  asociacion!:MedidorAsociado;
  @Input()
  medidorSelect:Medidor|null=null;
  @Input()
  perfilSelect:Perfil|null=null;
  @Input()
  asociacionSelect:MedidorAsociado|null=null;
  @Input()
  visible:boolean=false;
  @Output()
  sendVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  title:string=`Registrar nueva Asociacion de Medidor de agua $`;
  loading:boolean =false;
  @Input()
  showFormAsc:boolean = false;
  showFormAscEdit:boolean = false;
  showMap:boolean=false;
  private sub!:Subscription;
  // private debouncerSub!:Subscription;
  constructor(
    private readonly medidoresService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    public readonly commonAppService:CommonAppService,
    private fb: FormBuilder,){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sub=this.medidoresService.medidorAsociado.subscribe(res=>{
      console.log(res);
      this.loading=false;
      this.asociacion=res;
    })

    if(this.perfilSelect === null || this.medidorSelect===null)
    this.findAsociacion();
    else{
      this.afiliado.setValue({
        id:this.perfilSelect.afiliado!.id
      })
      this.medidor.setValue({
        id:this.medidorSelect.id
      })
      this.asociacionForm.addControl('medidor',this.medidor);
      this.asociacionForm.addControl('afiliado',this.afiliado);
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

  asociacionForm: FormGroup = this.fb.group({
    registrable:[,Validators.required],
    fechaInstalacion:[,Validators.required],
    estadoMedidorAsociado:[,Validators.required],
    estado:[],
    ubicacion: this.fb.group({
      barrio: [,Validators.required],
      latitud: [],
      longitud: [],
      numeroVivienda: [],
    })
    })
  afiliado:FormGroup = this.fb.group({
    id:[,Validators.required],
  });
  medidor:FormGroup = this.fb.group({
    id:[,Validators.required],
  });
  validForm(){
    console.log(this.asociacionForm);
    this.asociacionForm.markAllAsTouched();
    // console.log(this.medidorForm);
    if (this.asociacionForm.invalid) return;
    // console.log(this.clienteForm.value);
    let asociacionSend: MedidorAsociadoForm = {};
    console.log(this.asociacion);
    if (this.asociacion) {
      for (const [key, value] of Object.entries(this.asociacionForm.value)) {
        if (value !== this.asociacion[key as keyof MedidorAsociado]) {
          asociacionSend[key as keyof MedidorAsociadoForm] = value as any;
        }
      }
    } else {
      asociacionSend = Object.assign({}, this.asociacionForm.value);
      Object.entries(asociacionSend).forEach(([key, value]) => {
        if (value === null || value ===undefined) delete asociacionSend[key as keyof MedidorAsociadoForm];
      });
    }
    console.log('FORM: ',asociacionSend);
    this.registrarFormulario(asociacionSend);
  }
  get ubicacionForm(){
    return this.asociacionForm.controls['ubicacion'] as FormGroup
  }
  registrarFormulario(form: MedidorAsociadoForm) {
    this.confirmationService.confirm({
      message: `¿Está seguro de ${
        this.asociacion?.id
          ? 'actualizar este registro'
          : 'registrar este formulario'
      }?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.asociacion) {
          this.medidoresService.updateAsociacion(this.asociacion.id!, form).subscribe({
            next: (res) => {
              if(res.OK){

                this.messageService.add({
                  severity: 'info',
                  summary: 'Se cambio con exito!',
                  detail: `${res.message}`,
                  icon: 'pi pi-check',
                });
                // this.router.navigate([PATH_MEDIDORES, PATH_MODULE_DETAILS,this.medidorActual?.id], {
                // });
                this.showFormAscEdit=false;
                this.resetForm()
                this.findAsociacion();
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
          this.medidoresService.createAsociacion(form).subscribe({
            next: (res) => {
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                this.endVisible();
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
  findAsociacion(){
    if(this.asociacionSelect){
      this.loading=true;
      this.medidoresService.findOneAsociacion(this.asociacionSelect.id!).subscribe(res=>{
        // console.log(res);
      })
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UN ID ASOCIACION',
        life: 5000,
      });
      this.endVisible();
    }
  }
  endVisible(){
    // this.visible=false;
    this.sendVisible.emit(false);
    // console.log(this.visible);
  }
  actionData(option:string){
    switch (option) {
      case 'MODIFICAR':
        this.validForm()
        break;
      case 'DESHABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de Deshabilitar?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.medidoresService
              .updateStatusAsociacion(this.asociacion.id!, { estado: Estado.DESHABILITADO })
              .subscribe({
                next: (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Se cambio con exito!',
                    detail: `${res.message}`,
                    icon: 'pi pi-check',
                  });
                  this.findAsociacion();
                },
                error: (err) => {
                  console.log(err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al modificar!!',
                    detail: `Detalles del error: ???console`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                },
              });
          },
        });
        break;
      case 'HABILITAR':
        this.confirmationService.confirm({
          message: `¿Está seguro de HABILITAR?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.medidoresService
              .updateStatusAsociacion(this.asociacion.id!, { estado: Estado.ACTIVO })
              .subscribe({
                next: (res) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Se cambio con exito!',
                    detail: `${res.message}`,
                    icon: 'pi pi-check',
                  });
                  this.findAsociacion();
                },
                error: (err) => {
                  console.log(err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Ocurrió un error al modificar!!',
                    detail: `Detalles del error: ???console`,
                    life: 5000,
                    icon: 'pi pi-times',
                  });
                },
              });
          },
        });
        break;
      default:
        console.log('NO HAY ESA OPCION');
        break;
    }
  }
  activarForm(){
    this.afiliado.setValue({
      id:this.asociacion.afiliado?.id
    })
    this.medidor.setValue({
      id:this.asociacion.medidor?.id
    })
    this.asociacionForm.setValue({
      registrable:this.asociacion.registrable,
      fechaInstalacion:this.asociacion.fechaInstalacion,
      estado:this.asociacion.estado,
      estadoMedidorAsociado:this.asociacion.estadoMedidorAsociado,
      ubicacion:{
        barrio:this.asociacion.ubicacion?.barrio,
        latitud:this.asociacion.ubicacion?.latitud,
        longitud:this.asociacion.ubicacion?.longitud,
        numeroVivienda:this.asociacion.ubicacion?.numeroVivienda,
      },
      })
      this.asociacionForm.addControl('medidor',this.medidor);
      this.asociacionForm.addControl('afiliado',this.afiliado);
    
    this.showFormAscEdit=true;
    this.showFormAsc=false;
  }
  resetForm(){
    this.asociacionForm.reset();
    this.asociacionForm.removeControl('medidor');
    this.asociacionForm.removeControl('afiliado');
    this.showFormAscEdit=false;
  }

  limpiarCampo(campo: string) {
    if (
      !this.asociacionForm.get(campo)?.pristine &&
      this.asociacionForm.get(campo)?.value?.length === 0
    ) {
      this.asociacionForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.asociacionForm.controls[nombre].errors &&
      this.asociacionForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.asociacionForm.controls[nombre].errors &&
      this.asociacionForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.asociacionForm.controls[nombre].valid &&
        this.asociacionForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  limpiarCampoUbicacion(campo: string) {
    if (
      !this.ubicacionForm.get(campo)?.pristine &&
      this.ubicacionForm.get(campo)?.value?.length === 0
    ) {
      this.ubicacionForm.get(campo)?.reset();
    }
  }
  campoValidoUbicacion(nombre: string) {
    return (
      this.ubicacionForm.controls[nombre].errors &&
      this.ubicacionForm.controls[nombre].touched
    );
  }
  inputValidUbicacion(nombre: string) {
    return this.ubicacionForm.controls[nombre].errors &&
      this.ubicacionForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.ubicacionForm.controls[nombre].valid &&
        this.ubicacionForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  coordenadas($event:any){
    this.ubicacionForm.get('latitud')?.setValue($event.lat);
    this.ubicacionForm.get('longitud')?.setValue($event.lng);
  }
  get coordenadasLatLng(){
    return new L.LatLng(this.ubicacionForm.get('latitud')?.value ||-21.4734,this.ubicacionForm.get('longitud')?.value ||-64.8026);
  }

  
  //MESSAGES ERRORS TYPE

  getNumeroViviendaErrors(campo: string) {
    const errors = this.ubicacionForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 4 como minimo';
    } else if(errors?.['exist']){
      return `El numero de medidor esta registrado`
    }
    return '';
  }
  getMarcaErrors(campo: string) {
    const errors = this.asociacionForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 1 como minimo';
    }
    return '';
  }

  getEstadoErrors(campo: string) {
    const errors = this.asociacionForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getEstadoMedidorAsociadoErrors(campo: string) {
    const errors = this.asociacionForm.get(campo)?.errors;
    if (errors?.['required']) {
      return 'El campo es requerido';
    }
    return '';
  }
  getMedicionErrors(campo: string) {
    const errors = this.asociacionForm.get(campo)?.errors;
    if(errors?.['required']) 
      return 'El campo es requerido';
    return '';
  }
  getFuncionamientoErrors(campo:string){
    const errors = this.asociacionForm.get(campo)?.errors;
    if(errors?.['required']) 
      return 'El campo es requerido';
    return '';
    
  }
  getRegistrableErrors(campo:string){
    return '';
  }
  getBarrioErrors(campo:string){
    return '';
  }
  getFechaInstalacionErrors(campo: string) {
    const errors = this.asociacionForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'La fecha debe seguir el orden: dd/mm/yyyy';
    }
    return '';
  }
}
