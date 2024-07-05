import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilUsuarioFormComponent } from './perfil-usuario-form/perfil-usuario-form.component';
import { PerfilAfiliadoFormComponent } from './perfil-afiliado-form/perfil-afiliado-form.component';
import { PATH_AFILIADO, PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR, PATH_USER } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  //PERFILES
  {
    path: PATH_LISTAR,
    component: PerfilesComponent,
  },
  {
    path: `${PATH_MODULE_DETAILS}/:id`,
    component:PerfilDetailsComponent,
  },
  {
    path: PATH_REGISTRAR,
    component:PerfilFormComponent,
  },
  {
    path:`${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:PerfilFormComponent,
  },
  //PERFIL -> USER
  {
    path:`${PATH_USER}/${PATH_REGISTRAR}/:id`,
    component:PerfilUsuarioFormComponent,
  },
  {
    path:`${PATH_USER}/${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:PerfilUsuarioFormComponent,
  },
  //PERFIL -> AFILIADO
  {
    path:`${PATH_AFILIADO}/${PATH_REGISTRAR}/:id`,
    component:PerfilAfiliadoFormComponent,
  },
  {
    path:`${PATH_AFILIADO}/${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:PerfilAfiliadoFormComponent,
  },
  {
    path: '**',
    redirectTo: PATH_LISTAR,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilesRoutingModule { }
