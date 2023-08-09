import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemsMenuComponent } from './items-menu/items-menu.component';
import { ItemMenuDetailsComponent } from './item-menu-details/item-menu-details.component';
import { ItemMenuFormComponent } from './item-menu-form/item-menu-form.component';
import { accessResourceGuard } from '../../../guards/access-resource.guard';

const routes: Routes = [
  {
    path: 'item-menu-list',
    component: ItemsMenuComponent,
    // canActivate:[accessResourceGuard]
  },
  {
    path:'item-menu-details',
    component:ItemMenuDetailsComponent,
  },
  {
    path:'item-menu-register',
    component:ItemMenuFormComponent,
  },
  {
    path: '**',
    redirectTo: 'item-menu-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsMenuRoutingModule { }
