import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilUsuarioFormComponent } from './perfil-usuario-form/perfil-usuario-form.component';
import { PerfilAfiliadoFormComponent } from './perfil-afiliado-form/perfil-afiliado-form.component';

const routes: Routes = [
  {
    path: 'perfil-list',
    component: PerfilesComponent,
  },
  {
    path:'perfil-details',
    component:PerfilDetailsComponent,
  },
  {
    path:'perfil-register',
    component:PerfilFormComponent,
  },
  {
    path:'perfil-user-register',
    component:PerfilUsuarioFormComponent,
  },
  {
    path:'perfil-afiliado-register',
    component:PerfilAfiliadoFormComponent,
  },
  {
    path: '**',
    redirectTo: 'perfil-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilesRoutingModule { }
