import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CobrosComponent } from './cobros.component';
import { DeudasPerfilComponent } from './deudas-perfil/deudas-perfil.component';
import { FormRegisterDeudasComponent } from './form-register-deudas/form-register-deudas.component';
import { CobrosRoutingModule } from './cobros-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';


@NgModule({
  declarations: [
    CobrosComponent,
    DeudasPerfilComponent,
    FormRegisterDeudasComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CobrosRoutingModule,
    PrimeNgCrudModule,
    TreeTableModule,
  ]
})
export class CobrosModule { }
