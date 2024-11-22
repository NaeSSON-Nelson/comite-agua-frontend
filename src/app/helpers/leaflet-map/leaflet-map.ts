// map.component.ts
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-afiliado',
  template: `
  <p-dialog [style]="{'width':'85%', 'height':'90%'}" 
[modal]="true" [(visible)]="visible" header="Ubicacion geografica del afiliado"
[resizable]="true"
(onHide)="eventVisible.emit(false)"
[closable]="true"
>
    <div class="map-container">
      <div class="map-controls">
        <button pButton 
          label="Cambiar Capa" 
          (click)="toggleMapLayer()"
          class="p-button-raised p-button-info mr-2">
        </button>
        <!-- <button pButton 
          [label]="editMode ? 'Guardar Posición' : 'Editar Posición'"
          (click)="toggleEditMode()"
          [class.p-button-warning]="editMode"
          class="p-button-raised">
        </button> -->
      </div>
      <div id="map" class="map-frame"></div>
    </div>
    </p-dialog>
  `,
  styles: [`
    .map-container {
      position: relative;
      height: 500px;
      width: 100%;
    }
    .map-frame {
      height: 100%;
      width: 100%;
      border: 2px solid #ccc;
      border-radius: 4px;
    }
    .map-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      background: white;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
  `]
})
export class MapChangesComponent implements OnInit, AfterViewInit {
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  defaultCenter!:L.LatLng;
  private map!: L.Map;
  private marker!: L.Marker;
  // private defaultCenter = { lat: -21.481284966851753, lng: -64.77030561691659 };
  private baseLayers: { [key: string]: L.TileLayer } = {};
  private currentLayer: string = 'satellite';
  editMode: boolean = false;

   // Configuración del mapa
   private mapConfig = {
    minZoom: 4,      // Zoom mínimo permitido
    maxZoom: 16,     // Zoom máximo permitido
    defaultZoom: 15  // Zoom inicial
  };
  constructor() { }

  ngOnInit() {
    // Inicializar las capas base
    this.baseLayers = {
      streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom:this.mapConfig.maxZoom,
        minZoom:this.mapConfig.minZoom,
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom:this.mapConfig.maxZoom,
        minZoom:this.mapConfig.minZoom,
      }),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom:this.mapConfig.maxZoom,
        minZoom:this.mapConfig.minZoom,
      })
    };
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // Inicializar el mapa
    this.map = L.map('map',{
      center: [this.defaultCenter.lat, this.defaultCenter.lng],
      zoom: this.mapConfig.defaultZoom,
      minZoom: this.mapConfig.minZoom,
      maxZoom: this.mapConfig.maxZoom,
      zoomControl: true,  // Mostrar controles de zoom
      zoomSnap: 1,       // Incrementos de zoom
      zoomDelta: 1       // Delta para la rueda del mouse
    });
    
    // Agregar la capa inicial
    this.baseLayers[this.currentLayer].addTo(this.map);

    // Crear el icono personalizado para el marcador
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Inicializar el marcador
    this.createMarker(customIcon);
  }

  private createMarker(icon: L.Icon): void {
    // Si ya existe un marcador, removerlo
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Crear nuevo marcador con las opciones actualizadas
    this.marker = L.marker(
      [this.defaultCenter.lat, this.defaultCenter.lng],
      { 
        icon: icon,
        draggable: this.editMode
      }
    ).addTo(this.map);

    // Agregar popup al marcador
    this.marker.bindPopup('Mi ubicación');

    // Evento cuando se mueve el marcador
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      console.log('Nueva posición:', position);
      // Actualizar el popup con las nuevas coordenadas
      marker.setPopupContent(`Lat: ${position.lat.toFixed(5)}, Lng: ${position.lng.toFixed(5)}`);
    });
  }

  // Cambiar entre diferentes capas del mapa
  toggleMapLayer(): void {
    const layers = Object.keys(this.baseLayers);
    const currentIndex = layers.indexOf(this.currentLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    this.currentLayer = layers[nextIndex];

    // Remover todas las capas y agregar la nueva
    Object.values(this.baseLayers).forEach(layer => {
      this.map.removeLayer(layer);
    });
    this.baseLayers[this.currentLayer].addTo(this.map);
  }

  // Activar/desactivar modo de edición del marcador
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    
    // Recrear el marcador con la nueva configuración de draggable
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Mantener la posición actual al recrear el marcador
    const currentPos = this.marker.getLatLng();
    this.defaultCenter.lng = currentPos.lng;
    this.defaultCenter.lat = currentPos.lat;
    
    // Recrear el marcador
    this.createMarker(customIcon);
    
    if (this.editMode) {
      // Mostrar mensaje de ayuda
      this.map.openPopup(
        'Arrastra el marcador para cambiar su ubicación',
        this.marker.getLatLng(),
        { className: 'info-popup' }
      );
    } else {
      // Guardar la nueva posición
      const position = this.marker.getLatLng();
      console.log('Posición guardada:', position);
      this.map.closePopup();
    }
  }

  // Método para obtener la posición actual del marcador
  getCurrentPosition(): L.LatLng {
    return this.marker.getLatLng();
  }
}
