import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VerPaquete } from './pages/ver_paquete/ver-paquete';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'ver_paquete/:id',
    component: VerPaquete
  }
];
