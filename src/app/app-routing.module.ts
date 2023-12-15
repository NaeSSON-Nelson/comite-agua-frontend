import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { validarTokenGuard } from './guards/validar-token.guard';
import {
  PATH_AUTH,
  PATH_COBROS,
  PATH_DASHBOARD,
  PATH_EMPTY,
  PATH_FORBBIDEN,
  PATH_ITEMSMENU,
  PATH_LECTURAS,
  PATH_MEDIDORES,
  PATH_MENUS,
  PATH_PERFILES,
  PATH_ROLES,
  PATH_USER,
} from './interfaces/routes-app';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: PATH_PERFILES,
            loadChildren: () =>
              import('./components/perfiles/perfiles-routing.module').then(
                (m) => m.PerfilesRoutingModule
              ),
          },
          {
            path: PATH_MENUS,
            loadChildren: () =>
              import('./components/menus/menus-routing.module').then(
                (m) => m.MenusRoutingModule
              ),
          },
          {
            path: PATH_ITEMSMENU,
            loadChildren: () =>
              import(
                './components/menus/items-menu/items-menu-routing.module'
              ).then((m) => m.ItemsMenuRoutingModule),
          },
          {
            path: PATH_ROLES,
            loadChildren: () =>
              import('./components/roles/roles-routing.module').then(
                (m) => m.RolesRoutingModule
              ),
          },
          {
            path: PATH_MEDIDORES,
            loadChildren: () =>
              import(
                './components/medidores-agua/medidores-agua-routing.module'
              ).then((m) => m.MedidoresAguaRoutingModule),
          },
          {
            path: PATH_LECTURAS,
            loadChildren: () =>
              import(
                './components/medidores-agua/lecturas/lecturas-routing.module'
              ).then((m) => m.LecturasRoutingModule),
          },
          {
            path: PATH_COBROS,
            loadChildren: () =>
              import('./components/cobros/cobros-routing.module').then(
                (m) => m.CobrosRoutingModule
              ),
          },
          {
            path: PATH_USER,
            children: [
              {
                path: PATH_EMPTY,
                loadChildren: () =>
                  import(
                    './components/usuarios-funciones/usuarios-funciones-routing.module'
                  ).then((m) => m.UsuariosFuncionesRoutingModule),
              },
              {
                path: PATH_DASHBOARD,
                loadChildren: () =>
                  import('./dashboard/dashboard-routing.module').then(
                    (m) => m.DashboardRoutingModule
                  ),
              },
            ],
          },
        ],
        canActivate: [validarTokenGuard],
      },
      {
        path: PATH_AUTH,

        loadChildren: () =>
          import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
      },
    ],
  },
  {
    path: PATH_FORBBIDEN,
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
