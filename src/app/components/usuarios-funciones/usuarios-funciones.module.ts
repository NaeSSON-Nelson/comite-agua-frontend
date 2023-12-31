import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedidoresComponent } from './medidores/medidores.component';
import { LecturaDetailsComponent } from './lectura-details/lectura-details.component';
import { DeudasComponent } from './deudas/deudas.component';
import { UsuariosFuncionesRoutingModule } from './usuarios-funciones-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    MedidoresComponent,
    LecturaDetailsComponent,
    DeudasComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    UsuariosFuncionesRoutingModule,
    DropdownModule,
    DividerModule,
    HelpersModule,
    ButtonModule,
    TagModule,
    TableModule,
    DialogModule,
  ]
})
export class UsuariosFuncionesModule { }
