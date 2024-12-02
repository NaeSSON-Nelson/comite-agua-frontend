import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilUsuarioFormComponent } from './perfil-usuario-form/perfil-usuario-form.component';
import { PerfilAfiliadoFormComponent } from './perfil-afiliado-form/perfil-afiliado-form.component';
import { PATH_AFILIADO, PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR, PATH_USER, ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  //PERFILES
  {
    path: ValidItemMenu.perfilList,
    component: PerfilesComponent,
  },
  {
    path: `${ValidItemMenu.perfilDetails}/:id`,
    component:PerfilDetailsComponent,
  },
  {
    path: ValidItemMenu.perfilRegister,
    component:PerfilFormComponent,
  },
  {
    path:`${ValidItemMenu.perfilUpdate}/:id`,
    component:PerfilFormComponent,
  },
  //PERFIL -> USER
  {
    path:`${ValidItemMenu.perfilUserRegister}/:id`,
    component:PerfilUsuarioFormComponent,
  },
  {
    path:`${ValidItemMenu.perfilUserUpdate}/:id`,
    component:PerfilUsuarioFormComponent,
  },
  //PERFIL -> AFILIADO
  {
    path:`${ValidItemMenu.perfilAfiliadoRegister}/:id`,
    component:PerfilAfiliadoFormComponent,
  },
  {
    path:`${ValidItemMenu.perfilAfiliadoUpdate}/:id`,
    component:PerfilAfiliadoFormComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.perfilList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilesRoutingModule { }
