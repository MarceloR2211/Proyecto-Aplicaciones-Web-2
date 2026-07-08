import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'planes', pathMatch: 'full' },

  {
    path: 'planes',
    loadComponent: () => import('./features/planes/planes').then((m) => m.Planes)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/consultas/consultas').then((m) => m.Consultas)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login)
  },

  // ===== Rutas protegidas =====
  {
    path: 'dashboard-admin',
    canActivate: [authGuard, roleGuard],
    data: { titulo: 'Panel de Administrador', roles: ['admin'] },
    loadComponent: () =>
      import('./shared/en-construccion/en-construccion').then((m) => m.EnConstruccion)
  },
  {
    path: 'dashboard-cliente',
    canActivate: [authGuard, roleGuard],
    data: { titulo: 'Panel de Cliente', roles: ['usuario'] },
    loadComponent: () =>
      import('./shared/en-construccion/en-construccion').then((m) => m.EnConstruccion)
  },
  {
    path: 'cambiar-password',
    canActivate: [authGuard],
    data: { titulo: 'Cambiar Contraseña' },
    loadComponent: () =>
      import('./shared/en-construccion/en-construccion').then((m) => m.EnConstruccion)
  },

  { path: '**', redirectTo: 'planes' }
];