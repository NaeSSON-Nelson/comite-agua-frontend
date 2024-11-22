import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as L from 'leaflet';
@Component({
  selector: 'app-map-afiliado-details',
  templateUrl: './map-afiliado-details.component.html',
  styles: [`
    .map-container {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 30px;
    height: 85%;
    width: 90%;
  }
.map-frame {
    border: 2px solid black;
    height: 100%;
    width: 100%;
  }
  
#map {
    height: 100%;
  width: 100%;
  }
  `
  ]
})
export class MapAfiliadoDetailsComponent {
  constructor(private messageService: MessageService){}
  @Input()
  latLong!:L.LatLng;
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  private _map!:L.Map;

  private initMap(){
    this._map=L.map('map',{
      center: [ this.latLong?.lat ||-21.4734,this.latLong?.lng||-64.8026],
      zoom: 15,
      
    })
    
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      
    });
    tiles.addTo(this._map);
    const marker = L.marker({lat:this.latLong?.lat ||-21.4734,lng:this.latLong?.lng||-64.8026},{draggable:true,pane:'markerPane',title:'Ubicacion!'})
    marker.addEventListener("dragend",($event)=>{
      // console.log($event.target._latlng);
      
    //this.sendLatLong.emit($event.target._latlng)
      this.latLong=$event.target._latlng;
      console.log($event);
      console.log(this.latLong);
  })
    marker.addTo(this._map);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'impleme nts AfterViewInit' to the class.
    this.initMap();
  }
}
