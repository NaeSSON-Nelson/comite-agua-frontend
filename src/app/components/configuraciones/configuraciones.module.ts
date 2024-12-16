import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaConfiguracionesComponent } from './tabla-configuraciones.component';
import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { CardModule } from 'primeng/card';
import { TarifaCobroPorConsumoComponent } from './tarifa-cobro-por-consumo/tarifa-cobro-por-consumo.component';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { RegistrarTarifaComponent } from './tarifa-cobro-por-consumo/registrar-tarifa/registrar-tarifa.component';
import { TarifaMultaPorRetrasoPagoComponent } from './tarifa-multa-por-retraso-pago/tarifa-multa-por-retraso-pago.component';
import { RegistrarTarifaMultaComponent } from './tarifa-multa-por-retraso-pago/registrar-tarifa-multa/registrar-tarifa-multa.component';
import { BeneficiariosDescuentosComponent } from './beneficiarios-descuentos/beneficiarios-descuentos.component';
import { RegistrarNuevoBeneficiarioComponent } from './beneficiarios-descuentos/registrar-nuevo-beneficiario/registrar-nuevo-beneficiario.component';
import { InputTextareaModule } from 'primeng/inputtextarea';


@NgModule({
  declarations: [
    TablaConfiguracionesComponent,
    TarifaCobroPorConsumoComponent,
    RegistrarTarifaComponent,
    TarifaMultaPorRetrasoPagoComponent,
    RegistrarTarifaMultaComponent,
    BeneficiariosDescuentosComponent,
    RegistrarNuevoBeneficiarioComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
    TagModule,
    ToolbarModule,
    InputTextareaModule
  ]
})
export class ConfiguracionesModule { }
