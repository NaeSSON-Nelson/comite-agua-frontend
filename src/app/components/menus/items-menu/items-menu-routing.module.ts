import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemsMenuComponent } from './items-menu/items-menu.component';
import { ItemMenuDetailsComponent } from './item-menu-details/item-menu-details.component';
import { ItemMenuFormComponent } from './item-menu-form/item-menu-form.component';

const routes: Routes = [
  {
    path: '',
    component: ItemsMenuComponent,
  },
  {
    path:'details',
    component:ItemMenuDetailsComponent,
  },
  {
    path:'form',
    component:ItemMenuFormComponent,
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
export class ItemsMenuRoutingModule { }
