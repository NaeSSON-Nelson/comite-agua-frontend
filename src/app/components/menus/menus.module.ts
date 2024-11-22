import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusComponent } from './menus/menus.component';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenusRoutingModule } from './menus-routing.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';



@NgModule({
  declarations: [
    MenusComponent,
    MenuFormComponent,
    MenuDetailComponent
  ],
  imports: [
    CommonModule,
    MenusRoutingModule,
    PrimeNgCrudModule,
    ReactiveFormsModule,
    HelpersModule,
    TagModule,
    ToolbarModule,
  ]
})
export class MenusModule { }
