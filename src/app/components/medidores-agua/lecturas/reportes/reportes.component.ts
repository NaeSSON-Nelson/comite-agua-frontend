import { Component } from '@angular/core';
import { AnioSeguimientoLecturas, LecturasOptions, MesSeguimientoRegistroLectura, Perfil } from 'src/app/interfaces';
import { LecturasService } from '../lecturas.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Barrio } from '../../../../interfaces/atributes.enum';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  
  gestiones:any[]=[];
  data!:AnioSeguimientoLecturas;
  // titleTable = 'Lista de afiliados con sus medidores de agua';
  // debouncer: Subject<string> = new Subject<string>();
  showRegistros=false;
  constructor(
    private readonly lecturasService: LecturasService,
    private readonly messageService: MessageService,
    public readonly commonAppService:CommonAppService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {};
  lecturasOptions:LecturasOptions={
    
  }
  ngOnInit(): void {
    
    this.lecturasService.aniosSeguimiento.subscribe({
      next:res=>{ 
        // this.gestiones=res;
        // console.log(res);
        this.gestiones=res.map(ges=>{
          return {
            label:ges.anio?.toString(),
            value:ges.anio
          }
        })
      }
    })
    this.lecturasService.anioSeguimiento.subscribe({
      next:res=>{
        console.log(res);
        this.data=res;
      }
    })
    this.getSeguimientos();
  }
  getSeguimientos(){
    this.lecturasService.aniosSeguimientos().subscribe({
      next:res=>{
        if (res.OK === false) {
          switch (res.statusCode) {
            case 401:
              this.messageService.add({
                severity: 'info',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 3000,
              });
              break;
            case 403:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
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
      }
    })
  }
  
  getAllMesesSeguimiento(){
    this.lecturasService.lecturasPorMes(this.lecturasOptions).subscribe({
      next:res=>{
        console.log(res);
      }
    })
  }
  
  changeYear(event:any){
    // console.log(event);
    const gestion=this.gestiones.find(ges=>ges.value===event.value);
    // console.log(gestion);
    if(gestion) {
      this.lecturasOptions={
        gestion:gestion.value,
      }
      this.getAllMesesSeguimiento();
    }
  }
  mostrarModal(mes:string){
    console.log(mes);
    this.lecturasOptions.mes=mes;
    //this.lecturasOptions.barrio=Barrio._20DeMarzo;
    this.showRegistros=true;
  }
  closeModal(modal:boolean){
    this.showRegistros=modal;
  }
}
