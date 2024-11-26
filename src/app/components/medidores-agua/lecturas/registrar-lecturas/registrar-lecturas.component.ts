import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Barrio, Perfil } from 'src/app/interfaces';
import { LecturasService } from '../lecturas.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnioSeguimientoLecturas, Gestion, LecturasOptions, PlanillaMesLectura, lecturasRegisterForm } from 'src/app/interfaces/medidor.interface';
import { patternSpanishInline, patternText } from 'src/app/patterns/forms-patterns';
import { CommonAppService } from '../../../../common/common-app.service';

@Component({
  selector: 'app-registrar-lecturas',
  templateUrl: './registrar-lecturas.component.html',
  styleUrls:['./registrar-lecturas.component.css']
})
export class RegistrarLecturasComponent {
  data: Perfil[] = [];
  limite!:AnioSeguimientoLecturas
  constructor(
    private readonly lecturasService: LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    public readonly commonAppService:CommonAppService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  orderList=[
    {name:'ASC',value:'ASC'},
    {name:'DESC',value:'DESC'},
  ]
  sortList=[
    {name:'Barrio',value:'barrio'},
    {name:'Manzanos',value:'manzanos'},
  ]
  sortValue:any[]=[];
  lecturasOptions:LecturasOptions={
    limit:10,
    offset:0,
    sort:'id',
    order:'ASC',
  }
  filterType:any;
  filterDisabled:boolean=true;
  
  applySort(event:any){
    console.log(event);
    if(event.value === "barrio") {
      this.filterType=event.value;
      this.sortValue=this.commonAppService.barrios;
    }else if(event.value ==='manzanos'){
      this.filterType=event.value;
      this.lecturasService.obtenerTiposManzanos().subscribe(res=>{
        if(res.OK){
          this.sortValue=res.data!;
        }
      })
    }
    else if(event.value === null){
      this.sortValue=[];
      this.filterType=null;
      this.filterDisabled=true;
      this.lecturasOptions={
        limit:10,
        offset:0,
        sort:'id',
        order:'ASC',
      }
    }
    console.log(this.sortValue);
    // console.log(this.commonAppService.barrios);
  }
  applySortValue(event:any){
    console.log(event);
    if(event.value ===null){
      this.filterDisabled=true;
      this.lecturasOptions={
        limit:10,
        offset:0,
        sort:'id',
        order:'ASC',
      }
    }else if(this.filterType ==='barrio'){
      this.lecturasOptions['barrio'] = event.value;
      this.filterDisabled=false;
    } else if(this.filterType ==='manzanos'){
      this.lecturasOptions['manzano'] = event.value;
      this.filterDisabled=false;

    }
    else{
      console.log('OPTION NOT FOUND');
    }
  }
  // obtenerTiposManzanos(){
  //   const tipos:string[]=[];
  //   for(const perfil of this.data){
  //     if(!tipos.includes(perfil.afiliado!.ubicacion!.manzano!)){
  //       tipos.push(perfil.afiliado!.ubicacion!.manzano!);
  //     }
  //     for(const asc of perfil!.afiliado!.medidorAsociado!)
  //     if(!tipos.includes(asc!.ubicacion!.manzano!)){
  //       tipos.push(asc.ubicacion!.manzano!);
  //     }
  //   }
  //   console.log('tipos',tipos);
  //   return tipos.map(manzano=>{
  //     return{
  //       name:manzano.toUpperCase(),
  //       value:manzano 
  //     }
  //   });
  // }
  resetList(){
    this.sortValue=[];
    this.filterType=null;
    this.filterDisabled=true;
    this.lecturasOptions={
      limit:10,
      offset:0,
      sort:'id',
      order:'ASC',
    }
    this.getAllLecturas();
  }
  ngOnInit(): void {
    this.lecturasService.perfilesLecturas.subscribe({
      next:(res)=>{
        console.log('data:',res);
        this.lecturasOptions.limit=res.limit;
        this.lecturasOptions.offset=res.offset;
        // this.lecturasOptions.order=res.order;
        this.lecturasOptions.size=res.size;
        this.data=res.data;
      }
    })
    
    this.getLimiteRegistros();
    this.getAllLecturas();
  }
  lecturasForm:FormGroup=this.fb.group({
    
    registros: this.fb.array([],[Validators.required]),
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
        severity: 'warn',
        summary: 'HAY MEDIDORES MARCADOS SIN LECTURA',
        detail: 'REVISE LOS DEMAS BARRIOS',
        life:2850,
        icon: 'pi pi-check',
      });
      return;
    };
    const lecturasRegister:lecturasRegisterForm =this.lecturasForm.value;
    lecturasRegister.registros = this.lecturasArray.value.filter((filt:any)=>filt.lectura)
    if(lecturasRegister.registros.length===0){
      this.messageService.add({
        severity: 'info',
        summary: 'NO SE INGRESO NINGUNA LECTURA!',
        detail: 'Debe llenar almenos un campo de lectura',
        life:5000,
        icon: 'pi pi-check',
      });
      return;

    }
    console.log('send lectur',lecturasRegister)
    // return;
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
  loadCustomers(filters:any){
    // if(filters.globalFilter.value.length) return;
    console.log('filter',filters);
    this.lecturasOptions.offset=filters.first
    this.lecturasOptions.limit=filters.rows
    if(filters.globalFilter){
      if(filters.globalFilter.value.length===0)
      delete this.lecturasOptions.q
      else this.lecturasOptions.q = filters.globalFilter.value
    }
    this.getAllLecturas();
  }
  applySorteo(sorteo:any){
    console.log('sorteo',sorteo);
  }
  getLimiteRegistros(){
    this.lecturasService.limiteRegistrosLecturas().subscribe(res=>{
      console.log('limite: ',res);
      if(res.OK) this.limite=res.data!;
    })
  }
  getAllLecturas() {
    this.loading=true;
    this.lecturasService.AllPerfilesLecturas(this.lecturasOptions).subscribe({
      next: (res) => {
        this.loading=false;
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
  showLecturas=false;
 
  agregarPlanillaParaPago(){
    if(this.data.length>0){
      for(const pe of this.data){
        for(const asc of pe.afiliado!.medidorAsociado!){
          let lectura:any;
          this.lecturasArray.value.forEach((e:any)=>{
            if(e.planilla.id === asc.planillas![0].id) lectura=e;
          })
          if(!lectura){
            const lecturaItem = this.fb.group({
              lectura:[,[Validators.min(asc.lecturaSeguimiento!)]],
              estadoMedidor:[,[Validators.pattern(patternText)]],
              planilla:this.fb.group({
                id:[asc.planillas![0].id,Validators.required]
              }),
              medicion:[asc.medidor?.medicion,Validators.required],
              id:[ asc.planillas![0].lecturas[0].id,Validators.required]
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
  searchForm:FormGroup= this.fb.group({
    termino:[,[Validators.pattern(patternSpanishInline),Validators.minLength(3)]]
  },{updateOn:'change'});

  campoValido(nombre: string) {
    return (
      this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.searchForm.controls[nombre].valid &&
        this.searchForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  limpiarCampo(campo: string) {
    if (
      !this.searchForm.get(campo)?.pristine &&
      this.searchForm.get(campo)?.value?.length === 0
    ) {
      this.searchForm.get(campo)?.reset();
    }
  }
  getTerminoErrors(campo:string){
    const errors = this.searchForm.get(campo)?.errors;

    if(errors?.['pattern']){
      console.log(errors);
      return 'El buscador contiene caracteres no validos'
    }else if(errors?.['minlength']){
      return 'El tamaño minimo es 3'
    }
    return '';
  }
  visibleRegistrarLecturarExport:boolean=false;

}
