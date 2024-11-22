import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsMenuComponent } from './items-menu/items-menu.component';
import { ItemMenuFormComponent } from './item-menu-form/item-menu-form.component';
import { ItemMenuDetailsComponent } from './item-menu-details/item-menu-details.component';
import { PrimeNgCrudModule } from '../../../prime-ng-crud/prime-ng-crud.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemsMenuRoutingModule } from './items-menu-routing.module';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';



@NgModule({
  declarations: [
    ItemsMenuComponent,
    ItemMenuFormComponent,
    ItemMenuDetailsComponent
  ],
  imports: [
    CommonModule,
    ItemsMenuRoutingModule,
    PrimeNgCrudModule,
    ReactiveFormsModule,
    TagModule,
    ToolbarModule,
  ]
})
export class ItemsMenuModule { }
