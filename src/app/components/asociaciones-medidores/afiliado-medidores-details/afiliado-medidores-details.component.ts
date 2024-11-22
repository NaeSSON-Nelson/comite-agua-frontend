import { Component } from '@angular/core';
import { MedidoresAguaService } from '../../medidores-agua/medidores-agua.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Afiliado } from 'src/app/interfaces/afiliado.interface';
import { switchMap } from 'rxjs';
import { Medidor, MedidorAsociado } from 'src/app/interfaces/medidor.interface';
import { Estado, Perfil } from 'src/app/interfaces';
import { PATH_AFILIADO, PATH_AUTH, PATH_FORBBIDEN, PATH_MEDIDORES } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-afiliado-medidores-details',
  templateUrl: './afiliado-medidores-details.component.html',
  styles: [
  ]
})
export class AfiliadoMedidoresDetailsComponent {
  constructor(
    private readonly medidoresService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  perfil!: Perfil;
  medidorAsociadoSelected!: MedidorAsociado;
  medidoresPerfil:any[]=[];
  planillaVisible:boolean=false;
  gestionesVisible:boolean=false;
  asociaFormVisible:boolean=false;
  showMedidoresLibresVisible:boolean=false;
  medidorSelect:Medidor|null=null;
  formAsociar:boolean=false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.medidoresService.afiliadoWithMedidores.subscribe((res) => {
      this.perfil = res;
      if(res.afiliado){
        this.medidoresPerfil=[];
        for(const asc of res.afiliado.medidorAsociado!)
        this.medidoresPerfil.push({
          name:`${asc.medidor?.nroMedidor}${asc.isActive?'':' (deshabilitado)'}`,
          value:asc
        })
      }
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
        this.findAfiliado(id);
      
  }}
  findAfiliado(id:number){
    this.medidoresService.findOne(id).subscribe({
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
        }
      },
    });
  }
  actionData(action: string) {
    if(!this.medidorAsociadoSelected){
      this.messageService.add({
        severity: 'info',
        summary: 'Error',
        detail: `No ha seleccionado ningun medidor`,
        life: 1000,
      });
    }
    switch (action) {
      case 'DETALLES':
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
    this.findAfiliado(this.routerAct.snapshot.params['id']);
  }
  selectMedidor(data:any){
    this.medidorAsociadoSelected=data.value;
  }
  asociarMedidor(){
    // this.router.navigate(['medidores-agua','medidor-agua-register'],{queryParams:{idPerfil:this.perfil.id}})
    this.showMedidoresLibresVisible=true;
  }
  showPlanillas(){
    this.planillaVisible=!this.planillaVisible;
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
  
}
