import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfGeneratorComponent } from './pdf-generator/pdf-generator.component';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    PdfGeneratorComponent
  ],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports:[
    PdfGeneratorComponent
  ]
})
export class CommApponModule { }
