import { Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { PaginatorFind, Perfil } from 'src/app/interfaces';
import { PerfilService } from '../perfil.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { patternSpanishInline } from 'src/app/patterns/forms-patterns';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styles: [
  ]
})
export class PerfilesComponent {
  data: Perfil[] = [];
  titleTable = 'Perfiles registrados';
  debouncer: Subject<string> = new Subject<string>();
  constructor(
    private readonly perfilService: PerfilService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.perfilService.perfiles.subscribe((res) => {
      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.order=res.order;
      this.dataPaginator.size=res.size;
      this.data = res.data;
    });
    
    this.routerAct.queryParams.subscribe((res) => {
      if (res) {
        this.dataPaginator = { ...res };
        if(res['q']) {
          this.searchForm.get('termino')?.setValue(res['q']);
          this.debouncer.next(res['q'])}
      }
    });
    this.debouncer.pipe(debounceTime(300)).subscribe((res) => {
      // console.log(res);
      if (res) {
        this.dataPaginator = { q: res,offset:0,
          limit:10 };
        this.router.navigate(['.'],{queryParams:{q:res},relativeTo:this.routerAct})
      } else {
        this.dataPaginator = {offset:0,
          limit:10};
        this.router.navigate(['.'],{queryParams:{},relativeTo:this.routerAct})
      }
      this.findAll();
    });
    this.findAll();
  }
  searchForm:FormGroup= this.fb.group({
    termino:[,[Validators.pattern(patternSpanishInline),Validators.minLength(1)]]
  },{updateOn:'change'});

  dataPaginator: PaginatorFind = {
    offset:0,
    limit:50,
  };
  findAll() {
    this.perfilService.findAll(this.dataPaginator).subscribe({
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
      },
      
    });
  }
  dataDetail(id: number) {
    this.router.navigate(['perfiles', 'perfil-details'], { queryParams: { id } });
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
  search($event: any) {
    // console.log($event.target.value);
    this.searchForm.markAllAsTouched();
    if(this.searchForm.invalid) return;

    this.debouncer.next($event.target.value);
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
}
