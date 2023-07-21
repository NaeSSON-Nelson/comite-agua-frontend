import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



import { UsuariosRoutingModule } from './usuarios-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioPerfilComponent } from './usuario-perfil/usuario-perfil.component';
import { UsuarioRolesAsignComponent } from './usuario-roles-asign/usuario-roles-asign.component';
import { UsuarioPerfilFormComponent } from './usuario-perfil-form/usuario-perfil-form.component';
import { HelpersModule } from 'src/app/helpers/helpers.module';




@NgModule({
  declarations: [
    UsuariosComponent,
    UsuarioFormComponent,
    UsuarioPerfilComponent,
    UsuarioRolesAsignComponent,
    UsuarioPerfilFormComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
    HelpersModule,
  ]
})
export class UsuariosModule { }
