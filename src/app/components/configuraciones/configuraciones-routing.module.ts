import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ValidItemMenu } from 'src/app/interfaces/routes-app';
import { TablaConfiguracionesComponent } from './tabla-configuraciones.component';

const routes: Routes = [
  {
    path: ValidItemMenu.opcionesConfguracionTabla,
    component:TablaConfiguracionesComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.opcionesConfguracionTabla,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionesRoutingModule { }
