import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { AfiliadosRoutingModule } from './afiliados-routing.module';
import { AfiliadoDetailsComponent } from './afiliado-details/afiliado-details.component';
import { AfiliadoFormComponent } from './afiliado-form/afiliado-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AfiliadosComponent,
    AfiliadoDetailsComponent,
    AfiliadoFormComponent
  ],
  imports: [
    CommonModule,
    AfiliadosRoutingModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
  ]
})
export class AfiliadosModule { }
