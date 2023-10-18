import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfiliadosPlanillasComponent } from './afiliados-planillas/afiliados-planillas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PagosRoutingModule } from './pagos-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { PlanillasAfiliadoComponent } from './planillas-afiliado/planillas-afiliado.component';



@NgModule({
  declarations: [
    AfiliadosPlanillasComponent,
    PlanillasAfiliadoComponent
  ],
  imports: [
    
    CommonModule,
    ReactiveFormsModule,

    PagosRoutingModule,
    PrimeNgCrudModule,
    HelpersModule,
  ]
})
export class PagoServiciosModule { }
