import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CobrosComponent } from './cobros.component';
import { ValidItemMenu } from 'src/app/interfaces/routes-app';



const routes: Routes = [
  {
    path: ValidItemMenu.cobrosListarAsociacionesAfiliados,
    component: CobrosComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.cobrosListarAsociacionesAfiliados,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobrosRoutingModule { }
