import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenusComponent } from './menus/menus.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuFormComponent } from './menu-form/menu-form.component';

const routes: Routes = [
  {
    path: 'menu-list',
    component: MenusComponent,
  },
  {
    path:'menu-details',
    component:MenuDetailComponent,
  },
  {
    path:'menu-register',
    component:MenuFormComponent,
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
