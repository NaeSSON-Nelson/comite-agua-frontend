import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR, ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path: ValidItemMenu.rolList,
    component: RolesComponent,
  },
  {
    path: `${ValidItemMenu.rolDetails}/:id`,
    component:RoleDetailsComponent,
  },
  {
    path: ValidItemMenu.rolRegister,
    component:RoleFormComponent,
  },
  {
    path: `${ValidItemMenu.rolUpdate}/:id`,
    component:RoleFormComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.rolList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule { }
