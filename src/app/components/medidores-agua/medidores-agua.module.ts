import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
import { MedidoresAguaRoutingModule } from './medidores-agua-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { TabViewModule } from 'primeng/tabview';
import { MedidoresListarComponent } from './medidores-listar/medidores-listar.component';
import { MedidorDetailsComponent } from './medidor-details/medidor-details.component';

import { AsociacionMedidorDetailsComponent } from './asociacion-medidor-details/asociacion-medidor-details.component';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
@NgModule({
  declarations: [
    MedidorFormComponent,
    MedidoresListarComponent,
    MedidorDetailsComponent,
    AsociacionMedidorDetailsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabViewModule,
    MedidoresAguaRoutingModule,
    PrimeNgCrudModule,
    HelpersModule,
    TagModule,
    ToolbarModule
  ]
})
export class MedidoresAguaModule { }
