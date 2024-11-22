import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsociacionesListarComponent } from './asociaciones-listar/asociaciones-listar.component';
import { DetallesAsociacionaesComponent } from './detalles-asociacionaes/detalles-asociacionaes.component';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { AsociarMedidorComponent } from './asociar-medidor/asociar-medidor.component';
import { GestionPlanillasComponent } from './gestion-planillas/gestion-planillas.component';
import { ComprobanteLecturaComponent } from './comprobante-lectura/comprobante-lectura.component';
import { DetallesLecturaComponent } from './detalles-lectura/detalles-lectura.component';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import { GestionesComponent } from './gestiones/gestiones.component';
import { AdminGestionComponent } from './admin-gestion/admin-gestion.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReportLecturasComponent } from './report-lecturas/report-lecturas.component';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
@NgModule({
  declarations: [
    AsociacionesListarComponent,
    DetallesAsociacionaesComponent,
    AfiliadoMedidoresDetailsComponent,
    AsociarMedidorComponent,
    GestionPlanillasComponent,
    ComprobanteLecturaComponent,
    GestionPlanillasComponent,
    DetallesLecturaComponent,
    GestionesComponent,
    AdminGestionComponent,
    ReportLecturasComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
    HelpersModule,
    TabViewModule,
    DialogModule,
    DividerModule,
    ProgressSpinnerModule,
    ChartModule,
    TagModule,
  ]
})
export class AsociacionesMedidoresModule { }
