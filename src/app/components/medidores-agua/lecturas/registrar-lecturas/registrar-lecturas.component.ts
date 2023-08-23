import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Barrio, Perfil } from 'src/app/interfaces';
import { LecturasService } from '../lecturas.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LecturasOptions, lecturasRegisterForm } from 'src/app/interfaces/medidor.interface';
import { patternText } from 'src/app/patterns/forms-patterns';

@Component({
  selector: 'app-registrar-lecturas',
  templateUrl: './registrar-lecturas.component.html',
  styles: [
  ]
})
export class RegistrarLecturasComponent {
  data: Perfil[] = [];
  // titleTable = 'Lista de afiliados con sus medidores de agua';
  // debouncer: Subject<string> = new Subject<string>();
  constructor(
    private readonly lecturasService: LecturasService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}
  
  lecturasOptions:LecturasOptions={
    gestion:new Date().getFullYear(),
    mes:'ENERO',
    // barrio:Barrio._20DeMarzo
  }
  ngOnInit(): void {
    this.lecturasService.perfilesLecturas.subscribe({
      next:(res)=>{
        console.log(res);
        this.data=res.data;
      }
    })
    this.getAllLecturas();
  }
  lecturasForm:FormGroup=this.fb.group({
    mes:      [this.lecturasOptions.mes,[Validators.required]],
    registros: this.fb.array([],[Validators.required]),
    anio:     [this.lecturasOptions.gestion,[Validators.required,Validators.min(2000)]],
  });
  get lecturasArray(){
    return this.lecturasForm.get('registros') as FormArray;
  }
  addLectura(data:any,event:any){
    // console.log(event.target.value);
    // console.log(data);
    // if(lects.find())
    if(event.target.value.length===0) return;
    const lects = this.lecturasArray.value as Array<any>;
    const index= lects.findIndex(val=>val.planilla.id===data.id);
    // console.log(index);
    if(index!==-1){
      const control = this.lecturasArray.at(index);
      control.get('lectura')?.setValue(Number.parseInt(event.target.value));
    }else{
      const lecturaItem = this.fb.group({
        lectura:[Number.parseInt(event.target.value),[Validators.required,Validators.min(1)]],
        // estadoMedidor:[,Validators.pattern(patternText)],
        planilla:this.fb.group({
          id:[data.id,Validators.required]
        })
      })
      this.lecturasArray.push(lecturaItem);
    }
    // console.log(lects);
  }
  validForm(){
    this.lecturasForm.markAllAsTouched();
    console.log(this.lecturasForm);
    console.log(this.lecturasForm.value);
    if(this.lecturasForm.invalid) return;
    this.registrarFormulario(this.lecturasForm.value);
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
                this.router.navigate(['medidores-agua'])
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
  
  getAllLecturas() {
    this.lecturasService.AllPerfilesLecturas(this.lecturasOptions).subscribe({
      next: (res) => {
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
    });
  }
}
