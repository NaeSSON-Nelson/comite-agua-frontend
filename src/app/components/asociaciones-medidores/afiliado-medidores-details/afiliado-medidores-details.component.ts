import { Component } from '@angular/core';
import { MedidoresAguaService } from '../../medidores-agua/medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

import { Medidor, MedidorAsociado } from 'src/app/interfaces/medidor.interface';
import { Estado, Perfil } from 'src/app/interfaces';
import { PATH_AFILIADO, PATH_AUTH, PATH_FORBBIDEN, PATH_MEDIDORES } from 'src/app/interfaces/routes-app';
import { AsociacionesService } from '../asociaciones.service';

import * as L from 'leaflet';
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
    private routerAct: ActivatedRoute
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
  showGestiones(asc:MedidorAsociado){
    this.medidorAsociadoSelected=asc;
    this.gestionesVisible=true;
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
}
