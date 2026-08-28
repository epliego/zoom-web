import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/backoffice_usuario/iniciar_sesion/iniciar_sesion';
import { AutenticacionLayout } from './pages/backoffice_usuario/autenticacion_layout/autenticacion-layout';
import { Backoffice } from './pages/backoffice/backoffice';
import { routes as backofficeRoutes } from './pages/backoffice/backoffice.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'backoffice_usuario',
    pathMatch: 'full',
  },
  {
    path: 'backoffice_usuario',
    component: AutenticacionLayout,
    children: [
      {
        path: '',
        component: IniciarSesion,
      },
    ],
  },
  {
    path: 'backoffice',
    component: Backoffice,
    children: backofficeRoutes,
  },
  {
    path: '**',
    redirectTo: 'backoffice_usuario',
  },
];
