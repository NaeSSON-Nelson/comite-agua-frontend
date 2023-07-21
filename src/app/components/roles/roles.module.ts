import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesRoutingModule } from './roles-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { HelpersModule } from 'src/app/helpers/helpers.module';



@NgModule({
  declarations: [
    RolesComponent,
    RoleFormComponent,
    RoleDetailsComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ReactiveFormsModule,
    PrimeNgCrudModule,
    HelpersModule,
  ]
})
export class RolesModule { }
