import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemMenuSelectTableComponent } from './item-menu-select-table/item-menu-select-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgCrudModule } from '../prime-ng-crud/prime-ng-crud.module';
import { MenuSelectTableComponent } from './menu-select-table/menu-select-table.component';
import { RolesSelectTableComponent } from './roles-select-table/roles-select-table.component';
import { AfiliadoUserSelectTableComponent } from './afiliado-user-select-table/afiliado-select-table.component';
import { MapComponent } from './map/map.component';
import { MedidoresLibresSelectTableComponent } from './medidores-libres-select-table/medidores-libres-select-table.component';
import { MapChangesComponent } from './leaflet-map/leaflet-map';
import { TagModule } from 'primeng/tag';



@NgModule({
  declarations: [
    AfiliadoUserSelectTableComponent,
    ItemMenuSelectTableComponent,
    MenuSelectTableComponent,
    RolesSelectTableComponent,
    MapComponent,
    MedidoresLibresSelectTableComponent,
    MapChangesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
    TagModule,
  ],
  exports:[
    AfiliadoUserSelectTableComponent,
    ItemMenuSelectTableComponent,
    MenuSelectTableComponent,
    RolesSelectTableComponent,
    MapComponent,
    MedidoresLibresSelectTableComponent,
    MapChangesComponent,
  ]
})
export class HelpersModule { }
