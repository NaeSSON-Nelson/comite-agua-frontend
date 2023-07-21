import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedidoresComponent } from './medidores/medidores.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidoresAguaRoutingModule } from './medidores-agua-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';



@NgModule({
  declarations: [
    MedidoresComponent,
    MedidorFormComponent,
    AfiliadoMedidoresDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MedidoresAguaRoutingModule,
    PrimeNgCrudModule,
    HelpersModule,
  ]
})
export class MedidoresAguaModule { }
