import { Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { Medidor, PaginatorFind } from 'src/app/interfaces';
import { MedidoresAguaService } from '../medidores-agua.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { patternSpanishInline } from 'src/app/patterns/forms-patterns';
import { PaginatorState } from 'primeng/paginator';
import { PATH_AUTH, PATH_FORBBIDEN, PATH_MEDIDORES, PATH_MODULE_DETAILS, PATH_REGISTRAR, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-medidores-listar',
  templateUrl: './medidores-listar.component.html',
  styles: [
  ]
})
export class MedidoresListarComponent {
  data: Medidor[] = [];
  titleTable = 'MEDIDORES DE AGUA';
  constructor(
    private readonly medidorService: MedidoresAguaService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.medidorService.medidores.subscribe((res) => {

      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.order=res.order;
      this.dataPaginator.size=res.size;
      this.data = res.data;
    });
  }
  searchForm:FormGroup= this.fb.group({
    termino:[,[Validators.pattern(patternSpanishInline),Validators.minLength(1)]]
  },{updateOn:'change'});

  dataPaginator: PaginatorFind = {
    offset:0,
    limit:10,
  };
  findAll() {
    this.medidorService.findAll(this.dataPaginator).subscribe({
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
              this.router.navigate([PATH_AUTH]);
              break;
            case 403:
              this.messageService.add({
                severity: 'warn',
                summary: `OCURRIO UN ERROR AL OBTENER LA DATA:${res.error}`,
                detail: `${res.message},code: ${res.statusCode}`,
                life: 5000,
              });
              this.router.navigate([PATH_FORBBIDEN]);
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
  dataDetail(id: number) {
    this.router.navigate([ValidMenu.medidores, ValidItemMenu.medidorDetails,id]);
  }
  loadCustomers(filters:any){

    if(this.searchForm.invalid) return;
    console.log('customers',filters);
    if(filters.sortField){
      this.dataPaginator.sort=filters.sortField;
      this.dataPaginator.order= filters.sortOrder===1 ?'ASC': 'DESC';
    }
    this.dataPaginator.offset=filters.first
    this.dataPaginator.limit=filters.rows
    if(filters.globalFilter){
      if(filters.globalFilter.value.length===0)
      delete this.dataPaginator.q
      else this.dataPaginator.q = filters.globalFilter.value
    }
    this.findAll();
  }
  campoValido(nombre: string) {
    return (
      this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.searchForm.controls[nombre].valid &&
        this.searchForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  limpiarCampo(campo: string) {
    if (
      !this.searchForm.get(campo)?.pristine &&
      this.searchForm.get(campo)?.value?.length === 0
    ) {
      this.searchForm.get(campo)?.reset();
    }
  }
  
  onPageChange($event: PaginatorState) {
    console.log($event);
    this.dataPaginator.offset = $event.first;
    this.dataPaginator.limit = $event.rows;
    this.findAll();
  }

  getTerminoErrors(campo:string){
    const errors = this.searchForm.get(campo)?.errors;

    if(errors?.['pattern']){
      return 'El buscador contiene caracteres no validos'
    }else if(errors?.['minlength']){
      return 'El tamaño minimo es 1'
    }
    return '';
  }
 registrarForm(){
  
  this.router.navigate([PATH_MEDIDORES, PATH_REGISTRAR],);
 }
}
