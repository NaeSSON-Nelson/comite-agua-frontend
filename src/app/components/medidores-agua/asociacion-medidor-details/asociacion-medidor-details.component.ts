import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedidoresAguaService } from '../medidores-agua.service';
import { MessageService } from 'primeng/api';
import { MedidorAsociado } from 'src/app/interfaces';
import * as L from 'leaflet';
@Component({
  selector: 'app-asociacion-medidor-details',
  templateUrl: './asociacion-medidor-details.component.html',
  styles: [
  ]
})
export class AsociacionMedidorDetailsComponent {

  @Input()
  visibile:boolean=false;
  @Input()
  asociadoId:number=-1;
  asociacion!:MedidorAsociado;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(
    private readonly medidoresService: MedidoresAguaService,
    
    private readonly messageService: MessageService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerAsociacion();
  } 
  obtenerAsociacion(){
    if(this.asociadoId>0){
      this.medidoresService.findAsociacionMedidorDetails(this.asociadoId).subscribe(res=>{
        console.log('rsto details',res);
        if(res.OK){
          this.asociacion=res.data!;
        }
      })
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'SE DEBE MANDAR UNA ID VALIDO',
        life: 5000,
      });
    }
  } 

  get coordenadasLatLng(){
    return new L.LatLng(this.asociacion.ubicacion?.latitud ||-21.4734,this.asociacion.ubicacion?.longitud ||-64.8026);
  }
  visibleMapAsociado:boolean=false;
  mostrarMapAsociado(){
    if(this.asociacion.ubicacion?.latitud && this.asociacion.ubicacion?.longitud){
      this.visibleMapAsociado=true;
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'NO TIENE UBICACION GEORREFERENCIAL',
        life: 5000,
      });
    }
  }
}
