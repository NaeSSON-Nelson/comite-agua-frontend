import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsociacionesService } from '../asociaciones.service';
import { PlanillaLecturas } from 'src/app/interfaces/medidor.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-gestion',
  templateUrl: './admin-gestion.component.html',
  styles: [
  ]
})
export class AdminGestionComponent {

  @Input()
  visible:boolean=false;
  @Input()
  typeGestion:'ACTUAL'|'PASADO' ='PASADO';
  @Input()
  idAsociacion:number=-1;
  @Input()
  gest:number=-1;
  formGestionVisible:boolean=false;
  layoutVisible:boolean=false;
  layout={ width: '30vw', height:'30vw' }
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  gestion:PlanillaLecturas|null=null;
  constructor(private readonly asociacionService:AsociacionesService,
              private readonly messageService:MessageService,
              private readonly fb:FormBuilder,
              private readonly confirmationService: ConfirmationService,
  ){}
  formGestion:FormGroup = this.fb.group({
    asociacion:[,[Validators.required,Validators.min(1)]]
  })
  findGestion(){
    if(this.idAsociacion>0){

      if(this.typeGestion==='ACTUAL'){
        this.asociacionService.findGestionActual(this.idAsociacion).subscribe(res=>{
          console.log('res actual',res);
          this.layoutVisible=true;
          if(res.OK){
            this.layout.height='45vw'
            this.gestion=res.data!
          }else{
            this.formGestionVisible=true;
            this.layout.height='30vw'
            this.formGestion.get('asociacion')?.setValue(this.idAsociacion)
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn Message',
              detail: res.message,
              life: 5000,
            });
          }
        })
      }else if(this.typeGestion ==='PASADO'){
        if(this.gest===-1){
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn Message',
            detail: 'SE DEBE MANDAR UNA GESTION',
            life: 5000,
          });
        }else
        this.asociacionService.findGestion(this.idAsociacion,this.gest).subscribe(res=>{
          this.layoutVisible=true;
          console.log('res pasado',res);
          if(res.OK){
            this.layout.height='45vw'
            this.gestion=res.data!
          }else{
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn Message',
              detail: res.message,
              life: 5000,
            })
          }
        })
      }
    }
  }
  registrarForm(){
    console.log(this.formGestion);
    if(this.formGestion.invalid)return;
    this.confirmationService.confirm(
      {
        message: `SE REGISTRARÁ NUEVA GESTION DEL AÑO ACTUAL`,
        header: 'Confirmar Acción',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.layoutVisible=false;
          this.asociacionService.createGestion(this.formGestion.value).subscribe(res=>{
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Proceso exitoso!',
                detail: res.message,
                life: 2000,
              });
              
            this.formGestionVisible=false;
              this.findGestion();
            }else{
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: res.message,
                life: 5000,
              });
            }
          })
        },
      }
    )
  }
  updateRegistrable(){
    this.confirmationService.confirm(
      {
        message: `Se cambiara el registrable`,
        header: 'Confirmar Acción',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.layoutVisible=false;
          this.asociacionService.updateStatusGestion(this.gestion!.id!,this.gestion?.registrable?false:true).subscribe(res=>{
            if(res.OK){
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizacion de registrable Exitoso!',
                detail: res.message,
                life: 2000,
              });
              this.findGestion();
            }else{
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: res.message,
                life: 5000,
              });
            }
          })
        },
      }
    )
  }
  campoValido(nombre: string) {
    return (
      this.formGestion.controls[nombre].errors
    );
  }
  idAsociacionErrores(name:string){
    const errors = this.formGestion.get(name)?.errors;
    if(errors?.['required']){
      return '* ASOCIACION REQUERIDA'
    } else if(errors?.['min']){
      return '* VALOR MINIMO'
    }
    return '';
  }
}
