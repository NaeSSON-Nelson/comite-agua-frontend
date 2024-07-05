import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path: PATH_LISTAR,
    component: RolesComponent,
  },
  {
    path: `${PATH_MODULE_DETAILS}/:id`,
    component:RoleDetailsComponent,
  },
  {
    path: PATH_REGISTRAR,
    component:RoleFormComponent,
  },
  {
    path: `${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:RoleFormComponent,
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
export class RolesRoutingModule { }
