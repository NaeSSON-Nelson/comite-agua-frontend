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
import { FormMultasRegisterComponent } from './form-multas-register/form-multas-register.component';
import { FormMultasLecturasSelectComponent } from './form-multas-lecturas-select/form-multas-lecturas-select.component'
import {InputTextareaModule} from 'primeng/inputtextarea';
import { DetallesMultaComponent } from './detalles-multa/detalles-multa.component';
import { FormRegistrarPagoMultasSelectedComponent } from './form-registrar-pago-multas-selected/form-registrar-pago-multas-selected.component';
import { DetallesLecuturaPagoComponent } from './detalles-lecutura-pago/detalles-lecutura-pago.component'
import { TagModule } from 'primeng/tag';
@NgModule({
  declarations: [
    CobrosComponent,
    DeudasPerfilComponent,
    FormRegisterDeudasComponent,
    HistorialCobrosComponent,
    FormMultasRegisterComponent,
    FormMultasLecturasSelectComponent,
    DetallesMultaComponent,
    FormRegistrarPagoMultasSelectedComponent,
    DetallesLecuturaPagoComponent,
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
  ]
})
export class CobrosModule { }
