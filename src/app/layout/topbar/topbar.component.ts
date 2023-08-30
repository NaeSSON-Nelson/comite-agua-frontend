import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @Input()
  usuario: Usuario|null=null;
  items: MenuItem[]=[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  
  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService
  ) {}
  @Input()
  roles:any[]=[];
  rolChange(event:any){
    console.log(event.value);
    this.menusUser(event.value);
  }
  menusUser(idRol:number){
    this.authService.getMenusUser(idRol).subscribe(res=>{
      console.log(res);
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.usuario.subscribe(res=>{
      console.log('respuesta desde top bar',res);
      if(res.id){
        this.menusUser(res.roles![0].id!);
      }
    })
  }
}
