import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { validarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children:[
      {
        path:'auth',
        loadChildren:()=>import('./auth/auth-routing.module').then(m=>m.AuthRoutingModule),
      },
      {
        path:'dashboard',
        loadChildren:()=>import('./dashboard/dashboard-routing.module').then(m=>m.DashboardRoutingModule),
        canActivate:[validarTokenGuard]
      },
      {
        path:'afiliados',
        loadChildren:()=>import('./components/afiliados/afiliados-routing.module').then(m=>m.AfiliadosRoutingModule),
        canActivate:[validarTokenGuard]
      },
      {
        path:'usuarios',
        loadChildren:()=>import('./components/usuarios/usuarios-routing.module').then(m=>m.UsuariosRoutingModule),
        canActivate:[validarTokenGuard]
      },
      {
        path:'menus',
        loadChildren:()=>import('./components/menus/menus-routing.module').then(m=>m.MenusRoutingModule),
        canActivate:[validarTokenGuard]
      },
      {
        path:'roles',
        loadChildren:()=>import('./components/roles/roles-routing.module').then(m=>m.RolesRoutingModule),
        canActivate:[validarTokenGuard]
      },
      {
        path:'medidores-agua',
        loadChildren:()=>import('./components/medidores-agua/medidores-agua-routing.module').then(m=>m.MedidoresAguaRoutingModule),
        canActivate:[validarTokenGuard]
      },
    ]
  },
  {
        path: '**',
        redirectTo: '',
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
