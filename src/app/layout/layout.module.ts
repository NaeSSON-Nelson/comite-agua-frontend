import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';

import { LayoutComponent } from './layout.component';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { MenuitemComponent } from './menuitem/menuitem.component';
import {DropdownModule} from 'primeng/dropdown'
@NgModule({
  declarations: [
    LayoutComponent,
    MenuComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    MenuitemComponent,
  ],
  imports: [CommonModule, RouterModule, MenubarModule, TabMenuModule,DropdownModule],
})
export class LayoutModule {}
