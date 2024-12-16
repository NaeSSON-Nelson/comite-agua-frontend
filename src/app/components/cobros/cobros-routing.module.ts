import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CobrosComponent } from './cobros.component';
import { ValidItemMenu } from 'src/app/interfaces/routes-app';
import { RecortesDeServicioComponent } from './recortes-de-servicio/recortes-de-servicio.component';
import { RecionexionesDeServicioComponent } from './recionexiones-de-servicio/recionexiones-de-servicio.component';



const routes: Routes = [
  {
    path: ValidItemMenu.cobrosListarAsociacionesAfiliados,
    component: CobrosComponent,
  },
  {
    path: ValidItemMenu.cobrosRecortesDeServicio,
    component: RecortesDeServicioComponent,
  },
  {
    path: ValidItemMenu.cobrosReconexionesDeServicio,
    component: RecionexionesDeServicioComponent,
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
