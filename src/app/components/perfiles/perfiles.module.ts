import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';
import { PerfilUsuarioFormComponent } from './perfil-usuario-form/perfil-usuario-form.component';
import { PerfilAfiliadoFormComponent } from './perfil-afiliado-form/perfil-afiliado-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import { PrimeNgCrudModule } from 'src/app/prime-ng-crud/prime-ng-crud.module';
import { PerfilesRoutingModule } from './perfiles-routing.module';
import { UsuarioCreatedComponent } from './usuario-created/usuario-created.component';
import {TagModule} from 'primeng/tag'
import {Toolbar, ToolbarModule} from 'primeng/toolbar';
import { PerfilPdfComponent } from './perfil-pdf/perfil-pdf.component'
import { InplaceModule } from 'primeng/inplace';
import { ImageModule } from 'primeng/image';
import {FileUploadModule} from 'primeng/fileupload';
import { MapAfiliadoDetailsComponent } from './map-afiliado-details/map-afiliado-details.component'
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { PagoAfiliacionComponent } from './pago-afiliacion/pago-afiliacion.component';
@NgModule({
  declarations: [
    PerfilesComponent,
    PerfilFormComponent,
    PerfilDetailsComponent,
    PerfilUsuarioFormComponent,
    PerfilAfiliadoFormComponent,
    UsuarioCreatedComponent,
    PerfilPdfComponent,
    MapAfiliadoDetailsComponent,
    // PagoAfiliacionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HelpersModule,
    PrimeNgCrudModule,
    PerfilesRoutingModule,
    ToolbarModule,
    TagModule,
    InplaceModule,
    ImageModule,
    FileUploadModule,
    MultiSelectModule,
    RadioButtonModule,
  ],
  exports:[

  ]
})
export class PerfilesModule { }
