import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedidoresComponent } from './medidores/medidores.component';
import { LecturasComponent } from './lecturas/lecturas.component';
import { LecturaDetailsComponent } from './lecturas/lectura-details/lectura-details.component';
import { DeudasComponent } from './deudas/deudas.component';
import { UsuariosFuncionesRoutingModule } from './usuarios-funciones-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    MedidoresComponent,
    LecturasComponent,
    LecturaDetailsComponent,
    DeudasComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    UsuariosFuncionesRoutingModule,
    DropdownModule,
  ]
})
export class UsuariosFuncionesModule { }
