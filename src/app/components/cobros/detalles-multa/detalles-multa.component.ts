import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { MessageService } from 'primeng/api';
import { MultaServicio } from 'src/app/interfaces';

@Component({
  selector: 'app-detalles-multa',
  templateUrl: './detalles-multa.component.html',
  styles: [
  ]
})
export class DetallesMultaComponent {

  @Input()
  multaId:number=-1;
  @Input()
  visible:boolean=false;

  multa!:MultaServicio;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private readonly cobrosService:CobrosService,
    private readonly messageService: MessageService,
  ){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerMultaDetails();
  }
  obtenerMultaDetails(){
    if(this.multaId>0){
      this.cobrosService.findMulta(this.multaId).subscribe(res=>{
        console.log(res);
        if(res.OK){
          this.multa =res.data!; 
        }
      })
    }else{
      this.messageService.add({ severity: 'warn', summary: 'ERROR DE MULTA', detail: `ID DE MULTA INVALIDA ${this.multaId}`,life:5000 });
       
    }
  }
}
