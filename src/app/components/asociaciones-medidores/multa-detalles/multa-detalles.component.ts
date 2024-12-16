import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsociacionesService } from '../asociaciones.service';
import { MessageService } from 'primeng/api';
import { MultaServicio } from 'src/app/interfaces';

@Component({
  selector: 'app-multa-detalles',
  templateUrl: './multa-detalles.component.html',
  styles: [
  ]
})
export class MultaDetallesComponent {
  @Input()
  idMulta:number=-1;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  multa!:MultaServicio;
  title='DATOS DE MULTA';
  constructor(private readonly asociacionesService:AsociacionesService,
    private messageService:MessageService,){}
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.obtenerMultaDetalles();
    }
    obtenerMultaDetalles(){
      this.asociacionesService.obtenerMultaDetalles(this.idMulta).subscribe(res=>{
        if(res.OK){
          this.multa=res.data!;
        }
      })
    }
}
