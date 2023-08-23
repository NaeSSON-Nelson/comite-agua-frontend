import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet'
@Component({
  selector: 'app-map-coord',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @Input()
  latLong!:L.LatLng;
  @Output()
  sendLatLong:EventEmitter<L.LatLngExpression> = new EventEmitter<L.LatLngExpression>();
  private _map!:L.Map;

  private initMap(){
    this._map=L.map('map',{
      center: [ -21.4734,-64.8026 ],
      zoom: 15
    })
    this.latLong
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this._map);
    const marker = L.marker({lat:-21.4734,lng:-64.8026},{draggable:true,})
    this._map.on("click",($event)=>{
      console.log($event);
      console.log('se clickeo en el mapa');
    })
    
    marker.addEventListener("dragend",($event)=>{
      // console.log($event.target._latlng);
      
    this.sendLatLong.emit($event.target._latlng)
    })
    marker.addTo(this._map);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'impleme nts AfterViewInit' to the class.
    this.initMap();
  }
  enviarCoord(lat:number,lng:number){
    this.sendLatLong.emit({lat,lng})
  }
}
