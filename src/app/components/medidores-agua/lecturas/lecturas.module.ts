import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';
import { LecturasRoutingModule } from './lecturas-routing.module';
import { LecturasComponent } from './lecturas/lecturas.component';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LecturasMedidorComponent } from './lecturas-medidor/lecturas-medidor.component';
import { ReportesComponent } from './reportes/reportes.component';
import { LecturasRegistradasComponent } from './reportes/lecturas-registradas/lecturas-registradas.component';
import { ModalReportesComponent } from './modal-reportes/modal-reportes.component';
import {ToastModule} from 'primeng/toast'
import { GenerarListRegistroLecturasComponent } from './generar-list-registro-lecturas/generar-list-registro-lecturas.component';


@NgModule({
  declarations: [
    RegistrarLecturasComponent,
    LecturasComponent,
    LecturasMedidorComponent,
    ReportesComponent,
    LecturasRegistradasComponent,
    ModalReportesComponent,
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
