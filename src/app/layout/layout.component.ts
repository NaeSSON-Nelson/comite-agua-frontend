import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../interfaces';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
  ]
})
export class LayoutComponent {
  usuario:Usuario|null=null;
  userLevel:number=0;
  roles:any[]=[];
  constructor(private authService:AuthService){
    console.log('inicio layout');
  }
  ngOnInit(): void {
    this.authService.usuario.subscribe((res) => {
      console.log('respuesta desde usuario',res);
      console.log('respuesta:',res);
      this.usuario = res;
      console.log(this.usuario);
      if(res){
        this.roles=res.roles!.map(rol=>{
          return{name:rol.nombre,value:{id:rol.id,nivel:rol.nivel}};
        })
        this.userLevel = this.roles[0].value.nivel;
      }else{
        console.log('no usuario');
      }
    });
    
  }
  get containerClass() {
    return this.usuario?'layout-static':'layout-overlay';
  }
  typeRoleSelected(){
      
  }
}
