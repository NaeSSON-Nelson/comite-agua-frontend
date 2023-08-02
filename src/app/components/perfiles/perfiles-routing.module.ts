import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilesComponent,
  },
  {
    path:'details',
    component:PerfilDetailsComponent,
  },
  {
    path:'form',
    component:PerfilFormComponent,
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
export class PerfilesRoutingModule { }
