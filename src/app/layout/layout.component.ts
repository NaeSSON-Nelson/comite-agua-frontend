import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../interfaces';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './layout.service';
import { LocalStorageService } from '../common/storage/local-storage.service';
import { KEY_STORAGE } from '../interfaces/storage.enum';
import { IDataUser } from '../interfaces/auth.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
    .layout-main-container-left {
      margin-left: 300px;
    }`
  ]
})
export class LayoutComponent {
  usuario:Usuario|null=null;
  userLevel:number=0;
  roles:any[]=[];
  constructor(private authService:AuthService,
              private readonly layoutService:LayoutService,
              private readonly localStorageService:LocalStorageService,){
    // console.log('inicio layout');
  }
  ngOnInit(): void {
    // this.authService.usuario.subscribe((res) => {
    //   console.log('respuesta desde usuario RXJS',res);
    //   console.log('respuesta:',res);
    // });
    // this.authService.usuarioLog.subscribe(res=>{
    //   console.log('RESPUESTA DESDE LISTENER',res);
    // })
    this.layoutService.user.subscribe(res=>{
      // console.log('hay usurio layout: 3');
      console.log(res);
      this.usuario=res;
      if(res){
        this.roles=res.roles!.map(rol=>{
          return{name:rol.nombre,value:{id:rol.id,nivel:rol.nivel}};
        })
        this.userLevel = this.roles[0].value.nivel;
      }else{
        console.log('no usuario');
      }
    })
  }
  get containerClass() {
    if(this.usuario){
      if(this.userLevel>40)
      return 'layout-static';
      else  return 'layout-overlay'
    }else{
      return 'layout-overlay';
    }
    // return this.usuario?'layout-static':'layout-overlay';
  }
  typeRoleSelected(){
      
  }
  get containerMain(){
    if(this.usuario){
      if(this.userLevel>40)
      return 'layout-main-container-left';
      else  return ''
    }else{
      return '';
    }
  }
  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    // console.log('PAPITAS');
    const user =this.localStorageService.getItem<IDataUser>(KEY_STORAGE.DATA_USER);
    if(user)
    this.authService.getUser().subscribe(res=>{
      // console.log('suscrito',res);
      
      this.layoutService.userObserver.emit(res.data!)
    })
  }
}
