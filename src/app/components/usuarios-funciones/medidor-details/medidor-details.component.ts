import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedidorAsociado } from 'src/app/interfaces';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-medidor-details',
  templateUrl: './medidor-details.component.html',
  styles: [
  ]
})
export class MedidorDetailsComponent {

  @Input()
  idAsociado:number=-1;
  medidorAsociado!:MedidorAsociado;
  @Input()
  visible:boolean=false;

  loading:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly usuarioFunciones:UsuarioFuncionesService,
              private readonly messageService:MessageService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  obtenerAsociado(){
    this.loading=true;
    if(this.idAsociado>0){
      this.usuarioFunciones.getMedidorAsociadoSelected(this.idAsociado).subscribe(res=>{
        if(res.OK){
          this.medidorAsociado=res.data!;
        }
        this.loading=false;
      })
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error de asociación',
        detail:'El id no es valido',
        life: 5000,
      })
      this.loading=false;
    }
  }
}
