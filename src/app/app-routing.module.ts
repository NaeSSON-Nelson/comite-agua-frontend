import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { validarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivateChild:[validarTokenGuard],
    children: [  
      {
        path: 'auth',
        loadChildren: () =>import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
      },
      {
        path:'',
        canActivate:[validarTokenGuard],
        children:[
          {
            path: 'dashboard',
            loadChildren: () =>import('./dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule),
            // canActivate:[validarTokenGuard],
          },
          {
            path: 'perfiles',
            loadChildren: () =>import('./components/perfiles/perfiles-routing.module').then((m) => m.PerfilesRoutingModule),
            // canActivate:[validarTokenGuard],
          },
          {
            path: 'menus',
            loadChildren: () =>import('./components/menus/menus-routing.module').then((m) => m.MenusRoutingModule),
            // canActivate:[validarTokenGuard],
          },
          {
            path: 'items-menu',
            loadChildren: () =>import('./components/menus/items-menu/items-menu-routing.module').then((m) => m.ItemsMenuRoutingModule),
            // canActivate:[validarTokenGuard],
          },
          {
            path: 'roles',
            loadChildren: () =>import('./components/roles/roles-routing.module').then((m) => m.RolesRoutingModule),
            // canActivate:[validarTokenGuard],
          },
          {
            path: 'medidores-agua',
            loadChildren: () =>import('./components/medidores-agua/medidores-agua-routing.module').then((m) => m.MedidoresAguaRoutingModule),
            // canActivate:[validarTokenGuard],
          },
        ]
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
