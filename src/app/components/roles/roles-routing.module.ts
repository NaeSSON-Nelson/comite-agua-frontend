import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleFormComponent } from './role-form/role-form.component';

const routes: Routes = [
  {
    path: 'rol-list',
    component: RolesComponent,
  },
  {
    path:'rol-details',
    component:RoleDetailsComponent,
  },
  {
    path:'rol-register',
    component:RoleFormComponent,
  },
  {
    path: '**',
    redirectTo: 'rol-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule { }
