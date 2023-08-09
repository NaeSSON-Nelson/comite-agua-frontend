import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from '../../auth/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styles: [],
})
export class TopbarComponent {
  usuario?: Usuario;
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  
  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService
  ) {}
  roles:any[]=[];
  ngOnInit(): void {
    this.authService.usuario.subscribe((res) => {
      this.usuario = res;
      this.roles=res.roles!.map(rol=>{
       return{name:rol.nombre,value:rol};
      })

      console.log('respuesta desde el top-bar',res);
    });
    this.roles=[
      {name:'INVITADO',value:'INVITADO'},
    ]
  }
  rolChange(event:any){
    console.log(event.value);
    this.authService.getMenusUser(event.value.id).subscribe(res=>{
      console.log(res);
    });
  }
}
