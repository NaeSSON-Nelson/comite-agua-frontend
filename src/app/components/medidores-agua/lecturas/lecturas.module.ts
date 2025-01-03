import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';
import { LecturasRoutingModule } from './lecturas-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast'
import { GenerarListRegistroLecturasComponent } from './generar-list-registro-lecturas/generar-list-registro-lecturas.component';


@NgModule({
  declarations: [
    RegistrarLecturasComponent,
    GenerarListRegistroLecturasComponent,
  ],
  imports: [
    CommonModule,
    LecturasRoutingModule,
    PrimeNgCrudModule,
    ReactiveFormsModule,
    ToastModule,
  ]
})
export class LecturasModule { }
