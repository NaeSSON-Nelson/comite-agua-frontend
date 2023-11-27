import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { validarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: '',component: LayoutComponent,
    children: [  
      {path:'',
      children:[
        {path: 'perfiles',loadChildren: () =>import('./components/perfiles/perfiles-routing.module').then((m) => m.PerfilesRoutingModule),},
        {path: 'menus',loadChildren: () =>import('./components/menus/menus-routing.module').then((m) => m.MenusRoutingModule),},
        {path: 'items-menu',loadChildren: () =>import('./components/menus/items-menu/items-menu-routing.module').then((m) => m.ItemsMenuRoutingModule),},
        {path: 'roles',loadChildren: () =>import('./components/roles/roles-routing.module').then((m) => m.RolesRoutingModule),},
        {path: 'medidores-agua',loadChildren: () =>import('./components/medidores-agua/medidores-agua-routing.module').then((m) => m.MedidoresAguaRoutingModule),},
        {path:'lecturas',loadChildren:()=>import('./components/medidores-agua/lecturas/lecturas-routing.module').then((m)=>m.LecturasRoutingModule)},
        {path:'cobros',loadChildren:()=>import('./components/cobros/cobros-routing.module').then((m)=>m.CobrosRoutingModule)},
        {path:'user',children:[
          {path: '',loadChildren: () =>import('./components/usuarios-funciones/usuarios-funciones-routing.module').then((m) => m.UsuariosFuncionesRoutingModule),},
          {path: 'dashboard',loadChildren: () =>import('./dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule),},
        ]},
      ],
      canActivate:[validarTokenGuard],
    },
    {path: 'auth',
    
      loadChildren: () =>import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  },
    ],
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
