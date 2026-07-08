import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Verifica que el rol del usuario en sesión esté dentro de los roles
 * permitidos para la ruta (definidos en route.data['roles']).
 * Si el rol no coincide, redirige a SU propio dashboard en vez de bloquear
 * sin explicación (mismo criterio de roleMiddleware.js en el backend).
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as string[] | undefined;
  const usuario = authService.usuarioActual();

  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    const destinoPropio = usuario.rol === 'admin' ? '/dashboard-admin' : '/dashboard-cliente';
    router.navigate([destinoPropio]);
    return false;
  }

  return true;
};