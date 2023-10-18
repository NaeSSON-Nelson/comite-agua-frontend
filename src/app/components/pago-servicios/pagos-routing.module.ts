import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AfiliadosPlanillasComponent } from './afiliados-planillas/afiliados-planillas.component';
import { PlanillasAfiliadoComponent } from './planillas-afiliado/planillas-afiliado.component';

const routes: Routes = [
  {
    path: 'afiliados-planillas-list',
    component: AfiliadosPlanillasComponent,
  },
  {
    path: 'planillas-afiliado',
    component: PlanillasAfiliadoComponent,
  },
  {
    path: '**',
    redirectTo: 'afiliados-planillas-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagosRoutingModule { }
