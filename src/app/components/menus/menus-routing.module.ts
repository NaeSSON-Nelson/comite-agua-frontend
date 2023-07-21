import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenusComponent } from './menus/menus.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuFormComponent } from './menu-form/menu-form.component';

const routes: Routes = [
  {
    path: '',
    component: MenusComponent,
  },
  {
    path:'details',
    component:MenuDetailComponent,
  },
  {
    path:'form',
    component:MenuFormComponent,
  },
  {
    path:'items',
    loadChildren:()=>import('./items-menu/items-menu-routing.module').then(m=>m.ItemsMenuRoutingModule)
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
export class MenusRoutingModule { }
