import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CobrosService } from '../cobros.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { Perfil } from 'src/app/interfaces';
import { ValidatorArrayService } from './validator-array.service';

@Component({
  selector: 'app-form-multas-register',
  templateUrl: './form-multas-register.component.html',
  styles: [
  ]
})
export class FormMultasRegisterComponent {

  @Input()
  visible:boolean=false;
  visibleSelectLecturas:boolean=false;
  @Input()
  perfil!:Perfil;
  @Output()
  eventVisible:EventEmitter<{visible:boolean,refreshMultas?:boolean}> = new EventEmitter<{visible:boolean,refreshMulta?:boolean}>();
  constructor(
    
    private readonly cobrosService:CobrosService,
    private readonly messageService: MessageService,
    private readonly confirmationService:ConfirmationService,
    public readonly commonAppService:CommonAppService,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    
  }

  formMulta:FormGroup= this.fb.group({
    perfilMultadoId:[,[Validators.required]],
    monto:[,[Validators.required,Validators.min(5)]],
    moneda:[,[Validators.required]],
    motivo:[,[Validators.required,Validators.minLength(5)]],
    medidorAsociadoId:[,[Validators.required,Validators.min(1)]],
    lecturasMultadas:this.fb.array([],[Validators.required,ValidatorArrayService.hashTagsWithMaxSize(3,5)])
  })

  get lecturasMultadas(){
    return this.formMulta.get('lecturasMultadas') as FormArray;
  }
  lecturasMultadasList:any[]=[];
  lecturasMultadasAddList(event:any){
    this.lecturasMultadasList=event.lecturas;
    this.lecturasMultadas.clear();
    for(const lct of this.lecturasMultadasList){
      const form = this.fb.group({
        id:[lct.lecturaId,[Validators.required,Validators.min(1)]],
      })
      this.lecturasMultadas.push(form);
    }
    this.formMulta.get('perfilMultadoId')?.setValue(this.perfil.id);
    this.formMulta.get('medidorAsociadoId')?.setValue(event.asociadoId);
  }

  validarForm(){
    this.formMulta.markAllAsTouched();
    if(this.formMulta.invalid){
      this.messageService.add({ severity: 'warn', summary: 'HAY ERRORES DE VALIDACION', detail: `REVISEL LOS CAMPOS`,life:5000 });
      return;
    }
    console.log(this.formMulta);
    console.log(this.formMulta.value);
    this.registrarFormulario(this.formMulta.value);
  }

  registrarFormulario(form:any){
    
      this.confirmationService.confirm({
        message: `¿Esta seguro de registrar La multa?`,
        header: 'Confirmar Registro',
        icon: 'pi pi-info-circle',
        accept:()=>{
          this.sendRegister(form);
        },
      });
  }
  sendRegister(form:any){
    this.cobrosService.registrarMulta(form).subscribe(res=>{
      // console.log(res);
      if(res.OK){
        this.messageService.add({ severity: 'success', summary: 'EXITO EN EL REGISTRO!!', detail: res.message,life:5000 });
      
        this.eventVisible.emit({visible:false,refreshMultas:true});
      }else{
        this.messageService.add({ severity: 'warn', summary: 'ERRORES DE SERVIDOR', detail: res.message,life:5000 });
        console.log(res);
      }
    })
  }
  lecturasFormeErrors(){
    const errors = this.lecturasMultadas.errors;
    if(errors?.['required']){
      return 'LAS LECTURAS SON REQUERIDAS (*)';
    }else if(errors?.['minSize']){
      return `VALOR MINIMO DE LECTURAS ${errors?.['minSize']}`
    }else if (errors?.['maxSize']){
      return `VALOR MAXIMO DE LECTURAS ${errors?.['maxSize']}`
    }
    return'';
  }

  campoValido(nombre: string) {
    return (
      this.formMulta.controls[nombre].errors &&
      this.formMulta.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.formMulta.controls[nombre].errors &&
      this.formMulta.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  getMotivoErrors(name:string){
    const errors = this.formMulta.get(name)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido *';
    } else if(errors?.['minlength']){
      return 'EL CAMPO DEBE TENER 5 CARACTERES MINIMO';
    } 
    return '';
  }
  getMontoErrors(name:string){
    const errors = this.formMulta.get(name)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido *'
    } else if(errors?.['min']){
      console.log(errors);
      return `El monto minimo es ${errors?.['min'].minValue}`
    }
    return '';
  }
}
