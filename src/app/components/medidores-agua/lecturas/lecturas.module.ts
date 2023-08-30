import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';
import { LecturasRoutingModule } from './lecturas-routing.module';
import { LecturasComponent } from './lecturas/lecturas.component';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LecturasMedidorComponent } from './lecturas-medidor/lecturas-medidor.component';



@NgModule({
  declarations: [
    RegistrarLecturasComponent,
    LecturasComponent,
    LecturasMedidorComponent
  ],
  imports: [
    CommonModule,
    LecturasRoutingModule,
    PrimeNgCrudModule,
    ReactiveFormsModule,
  ]
})
export class LecturasModule { }
