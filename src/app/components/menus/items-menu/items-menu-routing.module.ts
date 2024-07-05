import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemsMenuComponent } from './items-menu/items-menu.component';
import { ItemMenuDetailsComponent } from './item-menu-details/item-menu-details.component';
import { ItemMenuFormComponent } from './item-menu-form/item-menu-form.component';
import { accessResourceGuard } from '../../../guards/access-resource.guard';
import { PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path: PATH_LISTAR,
    component: ItemsMenuComponent,
    // canActivate:[accessResourceGuard]
  },
  {
    path: `${PATH_MODULE_DETAILS}/:id`,
    component:ItemMenuDetailsComponent,
  },
  {
    path: PATH_REGISTRAR,
    component:ItemMenuFormComponent,
  },
  {
    path: `${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:ItemMenuFormComponent,
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
export class ItemsMenuRoutingModule { }
