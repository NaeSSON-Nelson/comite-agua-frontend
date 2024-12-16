import { Component } from '@angular/core';
import { MedidoresAguaService } from '../../medidores-agua/medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

import { Medidor, MedidorAsociado } from 'src/app/interfaces/medidor.interface';
import { Estado, Perfil } from 'src/app/interfaces';
import { PATH_AFILIADO, PATH_AUTH, PATH_FORBBIDEN, PATH_MEDIDORES } from 'src/app/interfaces/routes-app';
import { AsociacionesService } from '../asociaciones.service';

import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-afiliado-medidores-details',
  templateUrl: './afiliado-medidores-details.component.html',
  styles: [
  ]
})
export class AfiliadoMedidoresDetailsComponent {
  constructor(
    // private readonly medidoresService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly asociacionesService:AsociacionesService,
    private router: Router,
    private routerAct: ActivatedRoute,
    private fb:FormBuilder,
  ) {}

  perfil!: Perfil;
  medidoresAsociados: MedidorAsociado[]=[];
  medidorAsociadoSelected:MedidorAsociado|null=null;
  medidoresPerfil:any[]=[];
  planillaVisible:boolean=false;
  gestionesVisible:boolean=false;
  asociaFormVisible:boolean=false;
  showMedidoresLibresVisible:boolean=false;
  medidorSelect:Medidor|null=null;
  formAsociar:boolean=false;
  loadingAsociaciones:boolean=false;
  visibleHistorialCortes:boolean=false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.asociacionesService.perfil.subscribe((res) => {
      this.perfil = res;
      console.log('perfil',res);
    });
    if (!this.routerAct.snapshot.params['id']) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA REFERENCIA',
        life: 5000,
      });
      this.router.navigate([PATH_MEDIDORES,PATH_AFILIADO]);
      return;
    } else {
      const id =this.routerAct.snapshot.params['id']
        this.findPerfil(id);
  }}
  findPerfil(id:number){
    this.asociacionesService.findOnePerfil(id).subscribe({
      next: (res) => {
        // console.log(res);
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
              this.router.navigate([PATH_MEDIDORES])
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
        }else{
          this.obtenerAsociaciones();
        }
      },
    });
  }
  actionData(action: string,asociado:MedidorAsociado) {
    
    switch (action) {
      case 'DETALLES':
        this.medidorAsociadoSelected=asociado;
        this.medidorSelect=null;
        this.formAsociar=false;
        this.asociaFormVisible=true;
        break;
      default: 
      this.messageService.add({
        severity: 'info',
        summary: 'Error',
        detail: `Opcion no disponible`,
        life: 1000,
      });
        break;
    }
  }
  resetVisible(visible:boolean){
    this.asociaFormVisible = visible
    this.formAsociar=false;
    this.findPerfil(this.routerAct.snapshot.params['id']);
  }
  obtenerAsociaciones(){
    this.loadingAsociaciones=true;
    this.asociacionesService.obtenerAsociacionesAfiliado(this.perfil!.id!).subscribe(res=>{
      this.loadingAsociaciones=false;
      console.log(res);
      if(res.OK){
        this.medidoresAsociados=res.data!;
      }
    })
  }
  selectMedidor(data:any){
    this.medidorAsociadoSelected=data.value;
  }
  asociarMedidor(){
    // this.router.navigate(['medidores-agua','medidor-agua-register'],{queryParams:{idPerfil:this.perfil.id}})
    this.showMedidoresLibresVisible=true;
  }
  visibleMultas:boolean=false;
  showMultas(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.visibleMultas=true;

  }
  showGestiones(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.gestionesVisible=true;
  }
  showHistorialLectura(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.visibleHistorialCortes=true;
    
  }
  showPlanillas(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.planillaVisible=!this.planillaVisible;
  }
  showReportLecturas(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.visibleReportLecturas=true;
  }
  cerrarPlanillas(evento:boolean){
    this.planillaVisible=evento;
  }
  medidorSelectedOpt(event:any){
    this.medidorSelect=event;
    console.log('medidor pasado: ',this.medidorSelect);
    this.showMedidoresLibresVisible=false;
    this.formAsociar=true;
    this.asociaFormVisible=true;
  }
  visibleReportLecturas:boolean=false;
  
  visibleMapAsociacionMedidor:boolean=false;
  get coordenadasLatLngDetails(){
    return new L.LatLng(this.medidorAsociadoSelected!.ubicacion?.latitud,this.medidorAsociadoSelected!.ubicacion?.longitud);
  }
  mostrarMapAfiliado(asociacion:MedidorAsociado){
    this.medidorAsociadoSelected=asociacion;
    if(this.medidorAsociadoSelected.ubicacion?.latitud && this.medidorAsociadoSelected.ubicacion?.longitud){
      this.visibleMapAsociacionMedidor=true;
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'No se proporcionó los datos de georreferenciación a la asociación',
        life: 5000,
      });
    }
  }
  formCorte:FormGroup = this.fb.group({
    motivo:[,Validators.required]
  })
  visibleFormCorte:boolean=false;
  titleSolicitud:string='';
  getMotivoErrors(campo:string){
    const erorrs = this.formCorte.get(campo)?.errors;
    if(erorrs?.['required']){
      return `El campo es requerido`
    }
    return '';
  }
  limpiarCampo(campo: string) {
    if (
      !this.formCorte.get(campo)?.pristine &&
      this.formCorte.get(campo)?.value?.length === 0
    ) {
      this.formCorte.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.formCorte.controls[nombre].errors &&
      this.formCorte.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.formCorte.controls[nombre].errors &&
      this.formCorte.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.formCorte.controls[nombre].valid &&
        this.formCorte.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  abrirSolicitudCorte(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.titleSolicitud='SOLICITUD DE CORTE DE SERVICIO';
    this.visibleFormCorte=true;
  }
  abrirSolicitudReconexion(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.titleSolicitud='SOLICITUD DE RECONEXIÓN DE SERVICIO';
    this.visibleFormCorte=true;
  }
  confirmarSolicitarCorte(){
    if(this.formCorte.invalid) return;
    this.confirmationService.confirm({
      message: `¿Está seguro de autorizar corte de su servicio de agua?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
      accept:()=>{
        this.asociacionesService.solicitudCorte(this.medidorAsociadoSelected!.id!,this.formCorte.value).subscribe(res=>{
          if(res.OK){
            this.obtenerAsociaciones();
            this.visibleFormCorte=false;
            this.formCorte.reset();
            this.messageService.add({
              severity: 'info',
              summary: 'Solicitud realizada',
              detail: `${res.message}`,
              icon: 'pi pi-check',
            });
          }
        })
      }
    })
  }
  cancelarSolicitudCorte(asc:MedidorAsociado){
    this.confirmationService.confirm({
      message: `¿Está seguro de cancelar el corte de servicio solicitado?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
      accept:()=>{
        this.asociacionesService.cancelarSolicitudCorte(asc.id!).subscribe(res=>{
          if(res.OK){
            this.obtenerAsociaciones();
            this.messageService.add({
              severity: 'info',
              summary: 'Solicitud realizada',
              detail: `${res.message}`,
              icon: 'pi pi-check',
            });
          }
        })
      }
    })
  }
  cancelarSolicitudReconexion(asc:MedidorAsociado){
    this.confirmationService.confirm({
      message: `¿Está seguro de cancelar la solicitud de reconexión del servicio?`,
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
      accept:()=>{
        this.asociacionesService.cancelarSolicitudCorte(asc.id!).subscribe(res=>{
          if(res.OK){
            this.obtenerAsociaciones();
            this.messageService.add({
              severity: 'info',
              summary: 'Solicitud realizada',
              detail: `${res.message}`,
              icon: 'pi pi-check',
            });
          }
        })
      }
    })
  }
  confirmarSolicitarReconexion(){
    this.confirmationService.confirm({
      message: '¿Está seguro solicitar una reconexión del servicio?',
          header: 'Confirmar Acción',
          icon: 'pi pi-info-circle',
      accept:()=>{
        this.asociacionesService.solicitudReconexion(this.medidorAsociadoSelected!.id!,this.formCorte.value).subscribe(res=>{
          if(res.OK){
            this.obtenerAsociaciones();
            this.visibleFormCorte=false;
            this.formCorte.reset();
            this.messageService.add({
              severity: 'info',
              summary: 'Solicitud realizada',
              detail: `${res.message}`,
              icon: 'pi pi-check',
            });
          }
        })
      }
    })
  }
}
