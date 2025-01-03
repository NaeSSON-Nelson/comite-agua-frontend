import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";


import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

import { AuthModule } from './auth/auth.module';
import { RolesModule } from './components/roles/roles.module';
import { MedidoresAguaModule } from './components/medidores-agua/medidores-agua.module';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { PerfilesModule } from './components/perfiles/perfiles.module';
import { LecturasModule } from './components/medidores-agua/lecturas/lecturas.module';
import { UsuariosFuncionesModule } from './components/usuarios-funciones/usuarios-funciones.module';
import { CobrosModule } from './components/cobros/cobros.module';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorApiInterceptor } from './interceptors/error-api.interceptor';
import { AsociacionesMedidoresModule } from './components/asociaciones-medidores/asociaciones-medidores.module';
import { ReportesModule } from './components/reportes/reportes.module';

import {HttpClient} from "@angular/common/http";

// Localization
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { ConfiguracionesModule } from './components/configuraciones/configuraciones.module';

// Registrar el locale español
registerLocaleData(localeES, 'es');



@NgModule({
  declarations: [
    AppComponent,
    ForbiddenComponent,
  ],
  imports: [
    BrowserModule,
    
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    // //UNA SOLUCION AL ERROR: NOW?
    // AuthModule,
    // RolesModule,
    // MedidoresAguaModule,
    // PerfilesModule,
    // LecturasModule,
    // UsuariosFuncionesModule,
    // CobrosModule,
    // AsociacionesMedidoresModule,
    // ReportesModule,
    // ConfiguracionesModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass:ErrorApiInterceptor,
      multi:true,
    },
    { 
      provide: LOCALE_ID, 
      useValue: 'es' 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
