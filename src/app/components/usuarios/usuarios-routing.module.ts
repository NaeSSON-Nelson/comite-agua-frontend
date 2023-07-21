import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioPerfilComponent } from './usuario-perfil/usuario-perfil.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioRolesAsignComponent } from './usuario-roles-asign/usuario-roles-asign.component';
import { UsuarioPerfilFormComponent } from './usuario-perfil-form/usuario-perfil-form.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
  },
  {
    path:'perfil',
    component:UsuarioPerfilComponent,
  },
  {
    path:'form',
    component:UsuarioFormComponent,
  },
  {
    path:'roles/form',
    component:UsuarioRolesAsignComponent,
  },
  {
    path:'perfil/form',
    component:UsuarioPerfilFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule { }
