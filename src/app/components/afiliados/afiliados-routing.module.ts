import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AfiliadosComponent } from './afiliados/afiliados.component';
import { AfiliadoDetailsComponent } from './afiliado-details/afiliado-details.component';
import { AfiliadoFormComponent } from './afiliado-form/afiliado-form.component';

const routes: Routes = [
  {
    path: '',
    component: AfiliadosComponent,
  },
  {
    path:'detail',
    component:AfiliadoDetailsComponent,
  },
  {
    path:'form',
    component:AfiliadoFormComponent,
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
export class AfiliadosRoutingModule { }
