import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet'
import { MessageService } from 'primeng/api';


interface latLong{
  lat:string;
  lng:string;
}
@Component({
  selector: 'app-map-coord',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  latLongForm!:latLong;
  constructor(private messageService: MessageService,){}
  @Input()
  latLong!:L.LatLng;
  @Input()
  visible:boolean=false;
  @Output()
  closeModal:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  sendLatLong:EventEmitter<latLong> = new EventEmitter<latLong>();
  @Input()
  buttonInsert:boolean=false;
  private _map!:L.Map;

  private initMap(){
    this._map=L.map('map',{
      center: [ this.latLong?.lat ||-21.4734,this.latLong?.lng||-64.8026],
      zoom: 15,
      maxZoom:17,
      minZoom:4,
    })
    
    const tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 17,
      minZoom: 4,
      attribution: '© Esri',
      
    });
    tiles.addTo(this._map);
    const marker = L.marker({lat:this.latLong?.lat ||-21.4734,lng:this.latLong?.lng||-64.8026},{draggable:true,pane:'markerPane',title:'Ubicacion!'})
    marker.addEventListener("dragend",($event)=>{
      // console.log($event.target._latlng);
      
    //this.sendLatLong.emit($event.target._latlng)
      this.latLong=$event.target._latlng;
      console.log('event:',$event);
      console.log('event latlong',this.latLong);
      this.latLongForm={
        lat:$event.target._latlng.lat.toString(),
        lng:$event.target._latlng.lng.toString(),
      }
  })
    marker.addTo(this._map);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'impleme nts AfterViewInit' to the class.
    this.initMap();
  }
  enviarCoord(){
    console.log('LATLONG',this.latLong);
    console.log('LATLONG FORM',this.latLongForm);
    if(this.latLongForm?.lat && this.latLongForm?.lng){
      this.sendLatLong.emit(this.latLongForm)
      this.closedModal();
    }else{
      this.messageService.add({
        severity: 'info',
        summary: 'Datos no seleccionados',
        detail: `Debe seleccionar una ubicacion`,
        life: 2000,
        icon: 'pi pi-times',
      });
    }
  }
  closedModal(){
    this.visible=false;
    this.closeModal.emit(this.visible);
  }
}
