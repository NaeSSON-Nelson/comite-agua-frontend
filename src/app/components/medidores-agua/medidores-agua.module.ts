import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedidoresComponent } from './medidores/medidores.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidoresAguaRoutingModule } from './medidores-agua-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { GestionPlanillasComponent } from './gestion-planillas/gestion-planillas.component';
import { DetallesLecturaComponent } from './detalles-lectura/detalles-lectura.component';
import { ComprobanteLecturaComponent } from './comprobante-lectura/comprobante-lectura.component';
import { TabViewModule } from 'primeng/tabview';
import { MedidoresListarComponent } from './medidores-listar/medidores-listar.component';
import { MedidorDetailsComponent } from './medidor-details/medidor-details.component';
import { AsociarMedidorComponent } from './asociar-medidor/asociar-medidor.component';

@NgModule({
  declarations: [
    MedidoresComponent,
    MedidorFormComponent,
    AfiliadoMedidoresDetailsComponent,
    GestionPlanillasComponent,
    DetallesLecturaComponent,
    ComprobanteLecturaComponent,
    MedidoresListarComponent,
    MedidorDetailsComponent,
    AsociarMedidorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabViewModule,
    MedidoresAguaRoutingModule,
    PrimeNgCrudModule,
    HelpersModule,
  ]
})
export class MedidoresAguaModule { }
