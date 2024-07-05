import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenusComponent } from './menus/menus.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path:PATH_LISTAR,
    component: MenusComponent,
  },
  {
    path:`${PATH_MODULE_DETAILS}/:id`,
    component:MenuDetailComponent,
  },
  {
    path:PATH_REGISTRAR,
    component:MenuFormComponent,
  },
  {
    path:`${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:MenuFormComponent,
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
export class MenusRoutingModule { }
