import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'internet-index', pathMatch: 'full' },

  {
    path: 'internet-index',
    loadComponent: () =>
      import('./features/views-internet/components/index-main/index-main').then((m) => m.IndexMainComponent)
  },

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
      import('./features/views-internet/components/dashboard-admin/dashboard-admin').then((m) => m.DashboardAdminComponent)
  },
  {
    path: 'gestion-comentarios',
    canActivate: [authGuard, roleGuard],
    data: { titulo: 'Gestión de Comentarios', roles: ['admin'] },
    loadComponent: () =>
      import('./features/views-internet/components/gestion-comentarios/gestion-comentarios').then((m) => m.GestionComentariosComponent)
  },
  {
    path: 'dashboard-cliente',
    canActivate: [authGuard, roleGuard],
    data: { titulo: 'Panel de Cliente', roles: ['usuario'] },
    loadComponent: () =>
      import('./features/views-internet/components/dashboard-cliente/dashboard-cliente').then((m) => m.DashboardClienteComponent)
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