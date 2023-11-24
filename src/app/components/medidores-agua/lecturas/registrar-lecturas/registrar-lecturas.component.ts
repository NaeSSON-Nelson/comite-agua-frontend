import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Barrio, Perfil } from 'src/app/interfaces';
import { LecturasService } from '../lecturas.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnioSeguimientoLecturas, Gestion, LecturasOptions, MesLectura, lecturasRegisterForm } from 'src/app/interfaces/medidor.interface';
import { patternText } from 'src/app/patterns/forms-patterns';
import { CommonAppService } from '../../../../common/common-app.service';

@Component({
  selector: 'app-registrar-lecturas',
  templateUrl: './registrar-lecturas.component.html',
  styles: [
    `
    .fs-text{
      font-size: 1.15rem
    }`
  ]
})
export class RegistrarLecturasComponent {
  data: Perfil[] = [];
  gestiones:any[]=[];
  meses:any[]=[];
  // titleTable = 'Lista de afiliados con sus medidores de agua';
  // debouncer: Subject<string> = new Subject<string>();
  constructor(
    private readonly lecturasService: LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    public readonly commonAppService:CommonAppService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  
  lecturasOptions:LecturasOptions={
    barrio: null
  }
  ngOnInit(): void {
    this.lecturasService.perfilesLecturas.subscribe({
      next:(res)=>{
        console.log(res);
        this.data=res.data;
      }
    })
    // this.lecturasService.aniosSeguimiento.subscribe({
    //   next:res=>{ 
    //     // this.gestiones=res;
    //     // console.log(res);
    //     this.gestiones=res.map(ges=>{
    //       return {
    //         label:  ges.anio?.toString(),
    //         value:ges.anio,
    //         meses:ges.meses,
    //       }
    //     })
    //   }
    // })
    // this.getSeguimientos();
    this.getAllLecturas();
  }
  lecturasForm:FormGroup=this.fb.group({
    // anio:     [this.lecturasOptions.gestion,[Validators.required,Validators.min(2000)]],
    // mes:      [this.lecturasOptions.mes,[Validators.required]],
    registros: this.fb.array([]),
  });
  get lecturasArray(){
    return this.lecturasForm.get('registros') as FormArray;
  }
  validForm(){
    this.lecturasForm.markAllAsTouched();
    console.log(this.lecturasForm);
    console.log(this.lecturasForm.value);
    if(this.lecturasForm.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'HAY MEDIDORES MARCADOS SIN LECTURA',
        detail: 'REVISE LOS DEMAS BARRIOS',
        life:2850,
        icon: 'pi pi-check',
      });
      return
    };
    const lecturasRegister:lecturasRegisterForm =this.lecturasForm.value;
    lecturasRegister.registros = this.lecturasArray.value.filter((filt:any)=>filt.lectura)
    // console.log('send lectur',lecturasRegister);
    this.registrarFormulario(lecturasRegister);
  }
  registrarFormulario(formulario:lecturasRegisterForm){

    this.confirmationService.confirm({
      message: `¿Está seguro de registras las lecturas?`,
      header: 'Confirmar Acción',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.lecturasService.registerAllLecturas(formulario).subscribe({
            next: (res) => {
              console.log(res);
              if(res.OK){
                this.messageService.add({
                  severity: 'success',
                  summary: 'Registro Exitoso!',
                  detail: res.message,
                  icon: 'pi pi-check',
                });
                // this.router.navigate(['medidores-agua'])
                this.getAllLecturas();
              }else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ocurrió un error al registrar !!',
                  detail: `Detalles del error: console`,
                  life: 5000,
                  icon: 'pi pi-times',
                });
              }
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrió un error al registrar !!',
                detail: `Detalles del error: console`,
                life: 5000,
                icon: 'pi pi-times',
              });
              console.log(err);
            }
          });
      },
    });
  }
  showForm=false;
  loading=false;
  titleError ='';
  getAllLecturas() {
    this.lecturasService.AllPerfilesLecturas(this.lecturasOptions).subscribe({
      next: (res) => {
        if (res.OK === false) {
          switch (res.statusCode) {
            case 400:
            console.log(res);
            this.titleError=res.message;
              break;
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
          this.showForm=true;
          this.showLecturas=true;
          this.agregarPlanillaParaPago();
        }
      }
    });
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
  // changeYear(event:any){
  //   // console.log(event);
  //   const gestion=this.gestiones.find(ges=>ges.value===event.value);
  //   // console.log(gestion);
  //   if(gestion) {
  //     this.lecturasOptions={
  //       gestion:gestion.value,
  //       mes:null,
  //       barrio:Barrio._20DeMarzo
  //     }
  //     this.lecturasForm.get('anio')?.setValue(gestion.value);
  //     this.meses=gestion.meses
  //     this.showLecturas=false;
  //   }
  // }
  // changeMonth(event:any){
  //   // console.log(event);
  //   this.lecturasOptions.mes=event.value;
  //   this.lecturasForm.get('mes')?.setValue(event.value);
    
  //   this.showLecturas=false;
  // }
  showLecturas=false;
  // buscarLecturas(){
  //   if(this.lecturasOptions.gestion===null || this.lecturasOptions.mes===null){
  //     this.messageService.add({
  //       severity: 'info',
  //       summary: `DEBE SELECCIONAR EL AÑO Y MES DE GESTION!!`,
  //       life: 3000,
  //     });
  //     return
  //   }
  //   this.getAllLecturas();
  // }
  agregarPlanillaParaPago(){
    if(this.data.length>0){
      for(const pe of this.data){
        for(const medidor of pe.afiliado!.medidores!){
          let lectura:any;
          this.lecturasArray.value.forEach((e:any)=>{
            if(e.planilla.id === medidor.planillas![0].id) lectura=e;
          })
          if(!lectura){
            const lecturaItem = this.fb.group({
              lectura:[,[Validators.min(medidor.ultimaLectura!)]],
              estadoMedidor:[,[Validators.pattern(patternText)]],
              planilla:this.fb.group({
                id:[medidor.planillas![0].id,Validators.required]
              })
            })
            this.lecturasArray.push(lecturaItem);
          }
        }
      }
    }
    if(this.lecturasArray.length>0) this.lecturados=true;
  }
  changeBarrio(event:any){
    // console.log(event.value);
    this.lecturasOptions.barrio=event.value;
    this.getAllLecturas();
    
  }
  visibleGenerar:boolean=false;
  lecturados:boolean=false;
  inputArrayValid(nombre: string,index:number) {
    
    return this.lecturasArray.at(index).get(nombre)?.errors &&
           this.lecturasArray.at(index).get(nombre)?.touched
      ? 'ng-invalid ng-dirty'
      : this.lecturasArray.at(index).get(nombre)?.valid &&
        this.lecturasArray.at(index).get(nombre)?.touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  campoArrayValido(nombre: string,index:number) {
    return (
      this.lecturasArray.at(index).get(nombre)?.errors &&
      this.lecturasArray.at(index).get(nombre)?.touched
    );
  }
  addRequiredLectura(nombre:string,index:number){
// console.log(this.lecturasArray.at(index).get('estadoMedidor'));
if(nombre ==='estadoMedidor'){
  // console.log('estaondt');
  if(!this.lecturasArray.at(index).get('estadoMedidor')?.pristine && !this.lecturasArray.at(index).get('lectura')?.hasValidator(Validators.required)){
    // console.log('cambiado, name:',nombre);
    this.lecturasArray.at(index).get('lectura')?.addValidators(Validators.required);
    this.lecturasArray.at(index).get('lectura')?.updateValueAndValidity();
  }
}
  }
  getLecturaErrors(nombre:string,index:number){
    const errors = this.lecturasArray.at(index).get(nombre)?.errors;
    
    if(errors?.['required']){
      return 'el campo es requerido'
    } else if(errors?.['min']){
      return `lectura anterior: ${errors['min'].min}`
    } return '';
  }
  getEstadoMedidorErrors(nombre:string,index:number){    
    const errors = this.lecturasArray.at(index).get(nombre)?.errors;
    if(errors?.['pattern']){
      return `caracteres no validos`
    }
    return ''
  }
}
