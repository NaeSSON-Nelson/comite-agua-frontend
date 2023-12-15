import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CobrosComponent } from './cobros.component';



const routes: Routes = [
  {
    path: 'cobros-register',
    component: CobrosComponent,
  },
  {
    path: '**',
    redirectTo: 'cobros-register',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobrosRoutingModule { }
