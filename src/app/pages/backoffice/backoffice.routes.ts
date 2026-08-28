import { Routes } from '@angular/router';
import { Paquetes } from './paquetes/paquetes';
import { VerPaquete } from './ver_paquete/ver-paquete';

export const routes: Routes = [
  {
    path: 'paquetes',
    component: Paquetes,
  },
  {
    path: 'ver_paquete/:id',
    component: VerPaquete,
  },
];
