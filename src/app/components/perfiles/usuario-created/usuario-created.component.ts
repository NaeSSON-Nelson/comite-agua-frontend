import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {  ResponseCreatePerfil } from 'src/app/interfaces';
import { PATH_PERFILES, ValidMenu } from 'src/app/interfaces/routes-app';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as IPdf from 'pdfmake/interfaces';
@Component({
  selector: 'app-usuario-created',
  templateUrl: './usuario-created.component.html',
  styles: [
  ]
})
export class UsuarioCreatedComponent {

  @Input()
  displayModal:boolean = false;

  @Output()
  onCloseDetalles:EventEmitter<boolean> = new EventEmitter();

  @Input()
  dataSelected!:ResponseCreatePerfil;
  constructor( private readonly router:Router) { 
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
  }
  closeModal(){
    
    this.onCloseDetalles.emit(false);
    this.router.navigate([ValidMenu.perfiles]);
  }
  // @Output()
  // emitOperation:EventEmitter<EditData>= new EventEmitter();
  // operation(tipo:EditData){
  //   this.emitOperation.emit(tipo)
  // }


  generatePDF() {
    
      const { perfil:{nombrePrimero,nombreSegundo,apellidoPrimero,apellidoSegundo,usuario
      },dataUser:{messagePassword,passwordImplict,therePassword} } = this.dataSelected;
      
      // Documento PDF con página pequeña (tarjeta)
      const documentDefinition:IPdf.TDocumentDefinitions = {
        pageSize: {
          width: 250,  // Ancho en puntos (aproximadamente 8.8 cm)
          height: 350  // Alto en puntos (aproximadamente 12.3 cm)
        },
        pageMargins: [20, 20, 20, 20],
        content: [
          { 
            text: 'Credencial de Usuario', 
            style: 'header',
            alignment: 'center'
          },
          { text: '\n' },
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'Perfil:', bold: true },
                  { text: `${nombrePrimero} ${nombreSegundo ||''} ${apellidoPrimero} ${apellidoSegundo ||''}` }
                ],
                [{text:'Cuenta de acceso al sistema',colSpan:2, bold:true},
                  {text:''}
                ],
                [
                  { text: 'Nombre de usuario', bold: true },
                  { text: usuario?.username }
                ],
                // [
                //   { text: 'Contraseña:', bold: true },
                //   { text: username }
                // ],
                [
                  { text: 'Contraseña:', bold: true },
                  { text: passwordImplict }
                ],
                [
                  { text: 'Fecha:', bold: true },
                  { text: new Date().toLocaleDateString('es-ES') }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex:any) {
                return (rowIndex % 2 === 0) ? '#f2f2f2' : null;
              }
            }
          },
          { 
            text: '\nNota: Cambiar contraseña al primer inicio.', 
            italics: true,
            color: 'gray',
            fontSize: 8,
            alignment: 'center'
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            color: '#333'
          }
        }
      };

      // Generar y descargar el PDF
      pdfMake.createPdf(documentDefinition).download(`Cuenta_${usuario?.username}.pdf`);
    
  }
}

