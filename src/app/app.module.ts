import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";


import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

import { AuthModule } from './auth/auth.module';
import { ItemsMenuModule } from './components/menus/items-menu/items-menu.module';
import { MenusModule } from './components/menus/menus.module';
import { RolesModule } from './components/roles/roles.module';
import { MedidoresAguaModule } from './components/medidores-agua/medidores-agua.module';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { PerfilesModule } from './components/perfiles/perfiles.module';
import { LecturasModule } from './components/medidores-agua/lecturas/lecturas.module';
import { PagoServiciosModule } from './components/pago-servicios/pago-servicios.module';



@NgModule({
  declarations: [
    AppComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    ToastModule,
    ConfirmDialogModule,

    // //UNA SOLUCION AL ERROR: NOW?
    // AuthModule,
    // ItemsMenuModule,
    // MenusModule,
    // RolesModule,
    // MedidoresAguaModule,
    // PerfilesModule,
    // LecturasModule,
    // PagoServiciosModule,
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
