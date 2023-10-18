import { Component } from '@angular/core';
import { PagosService } from '../pagos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from 'src/app/interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-planillas-afiliado',
  templateUrl: './planillas-afiliado.component.html',
  styles: [
  ]
})
export class PlanillasAfiliadoComponent {
  constructor(
    private readonly pagosService: PagosService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  perfil!: Perfil;
  //planilla!: Medidor;
  planillaVisible:boolean=false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.pagosService.afiliado.subscribe((res) => {
      this.perfil = res;
    });
    if (!this.router.url.includes('id')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn Message',
        detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
        life: 5000,
      });
      this.router.navigate(['afiliados-planillas-list']);
      return;
    } else {
      this.routerAct.queryParams
        .pipe(switchMap(({ id }) => this.pagosService.findOne(id)))
        .subscribe({
          next: (res) => {
            if (res.OK === false) {
              switch (res.statusCode) {
                case 401:
                  this.messageService.add({
                    severity: 'info',
                    summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                    detail: `${res.message},code: ${res.statusCode}`,
                    life: 3000,
                  });
                  this.router.navigate(['auth', 'login']);
                  break;
                case 403:
                  this.messageService.add({
                    severity: 'warn',
                    summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                    detail: `${res.message},code: ${res.statusCode}`,
                    life: 5000,
                  });
                  this.router.navigate(['forbidden']);
                  break;
                case 404:
                  this.messageService.add({
                    severity: 'warn',
                    summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                    detail: `${res.message},code: ${res.statusCode}`,
                    life: 5000,
                  });
                  this.router.navigate(['medidores-agua'])
                  break;
                default:
                  console.log(res);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error no controlado',
                    detail: 'revise la consola',
                    life: 5000,
                  });
                  break;
              }
            }
          }
        });
    }
  }

}
