import { Component } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';
import { Perfil } from 'src/app/interfaces';
import { RolesService } from '../../roles/roles.service';
import { MessageService } from 'primeng/api';

import * as L from 'leaflet';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent {

  constructor(private readonly usuarioFuncionesService:UsuarioFuncionesService,
    private readonly rolesService: RolesService,
    private readonly messageService: MessageService,){}
  userPerfil!:Perfil;
  perfilSuscribe!:Subscription;
  ngOnInit(): void {
    this.findPerfil();
  }
  mapModal=false;
  findPerfil(){
     this.perfilSuscribe=this.usuarioFuncionesService.getPerfilUser().subscribe(res=>{
      if(res.OK){
        this.userPerfil=res.data!;
       // console.log(res);
      }else{
        //console.log(res);
        this.messageService.add({
          severity: 'error',
          summary: 'Error no controlado',
          detail:res.message,
          life: 5000,
        });
      }
    })
  }
  get coordenadasLatLng(){
    
    return new L.LatLng(this.userPerfil.afiliado?.ubicacion?.latitud ||-21.4734,this.userPerfil.afiliado?.ubicacion?.longitud ||-64.8026);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // console.log('ejecutando papu perfil closed');
    this.userPerfil={}
    this.perfilSuscribe.unsubscribe();
  }
}
