import { Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuariosService } from '../usuarios.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { patternSpanishInline } from 'src/app/patterns/forms-patterns';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent {
  data: Usuario[] = [];
  titleTable = 'Lista de Afiliados con acceso al sistema';
  debouncer: Subject<string> = new Subject<string>();
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private routerAct: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.usuariosService.usuarios.subscribe((res) => {
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
    this.usuariosService.findAll(this.dataPaginator).subscribe({
      next: (res) => {
        if (!res) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn Message',
            detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
            life: 5000,
          });
        }else{

        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warn Message',
          detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
          life: 5000,
        });
      },
    });
  }
  dataDetail(id: number) {
    this.router.navigate(['usuarios', 'perfil'], { queryParams: { id } });
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
    // console.log($event);
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
