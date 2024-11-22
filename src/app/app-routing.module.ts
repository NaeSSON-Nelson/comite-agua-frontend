import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForbiddenComponent } from './common/forbidden/forbidden.component';
import { validarTokenGuard } from './guards/validar-token.guard';
import {
  PATH_ASOCIACIONES,
  PATH_AUTH,
  PATH_COBROS,
  PATH_DASHBOARD,
  PATH_EMPTY,
  PATH_FORBBIDEN,
  PATH_ITEMSMENU,
  PATH_LECTURAS,
  PATH_MEDIDORES,
  PATH_MENUS,
  PATH_NOTFOUND,
  PATH_PERFILES,
  PATH_ROLES,
  PATH_USER,
} from './interfaces/routes-app';
import { NotFound404Component } from './public/not-found404/not-found404.component';

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
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_MENUS,
            loadChildren: () =>
              import('./components/menus/menus-routing.module').then(
                (m) => m.MenusRoutingModule
              ),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_ITEMSMENU,
            loadChildren: () =>
              import(
                './components/menus/items-menu/items-menu-routing.module'
              ).then((m) => m.ItemsMenuRoutingModule),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_ROLES,
            loadChildren: () =>
              import('./components/roles/roles-routing.module').then(
                (m) => m.RolesRoutingModule
              ),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_MEDIDORES,
            loadChildren: () =>
              import(
                './components/medidores-agua/medidores-agua-routing.module'
              ).then((m) => m.MedidoresAguaRoutingModule),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_ASOCIACIONES,
            loadChildren: () =>
              import(
                './components/asociaciones-medidores/asociaciones-routing.module'
              ).then((m) => m.AsociacionesRoutingModule),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_LECTURAS,
            loadChildren: () =>
              import(
                './components/medidores-agua/lecturas/lecturas-routing.module'
              ).then((m) => m.LecturasRoutingModule),
            canActivate: [validarTokenGuard],
          },
          {
            path: PATH_COBROS,
            loadChildren: () =>
              import('./components/cobros/cobros-routing.module').then(
                (m) => m.CobrosRoutingModule
              ),
            canActivate: [validarTokenGuard],
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
            canActivate: [validarTokenGuard],
          },
        ],
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
    path: PATH_NOTFOUND,
    component: NotFound404Component,
  },
  {
    path: '**',
    redirectTo: PATH_NOTFOUND,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
