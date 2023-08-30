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
  
  roles:any[]=[];
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.authService.usuario.subscribe((res) => {
      console.log('respuesta desde usuario',res);
      console.log('respuesta:',res);
      this.usuario = res;
      this.roles=res.roles!.map(rol=>{
       return{name:rol.nombre,value:rol.id};
      })
    });
    
  }
  get containerClass() {
    return this.usuario?'layout-static':'layout-overlay';
  }
}
