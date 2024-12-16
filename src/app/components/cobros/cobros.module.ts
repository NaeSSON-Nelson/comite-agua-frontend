import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CobrosComponent } from './cobros.component';
import { DeudasPerfilComponent } from './deudas-perfil/deudas-perfil.component';
import { FormRegisterDeudasComponent } from './form-register-deudas/form-register-deudas.component';
import { CobrosRoutingModule } from './cobros-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { HistorialCobrosComponent } from './historial-cobros/historial-cobros.component';
import {TabViewModule} from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { DetallesLecuturaPagoComponent } from './detalles-lecutura-pago/detalles-lecutura-pago.component'
import { TagModule } from 'primeng/tag';
import { RecortesDeServicioComponent } from './recortes-de-servicio/recortes-de-servicio.component';
import { RecionexionesDeServicioComponent } from './recionexiones-de-servicio/recionexiones-de-servicio.component';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [
    CobrosComponent,
    DeudasPerfilComponent,
    FormRegisterDeudasComponent,
    HistorialCobrosComponent,
    DetallesLecuturaPagoComponent,
    RecortesDeServicioComponent,
    RecionexionesDeServicioComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CobrosRoutingModule,
    PrimeNgCrudModule,
    TreeTableModule,
    TabViewModule,
    InputTextareaModule,
    TagModule,
    ToolbarModule,
  ]
})
export class CobrosModule { }
