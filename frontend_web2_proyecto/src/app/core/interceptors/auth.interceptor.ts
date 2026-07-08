import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * No existe JWT real: el backend valida mediante los headers
 * x-usuario-id / x-usuario-rol (ver auth.middleware.js).
 * Este interceptor los adjunta automáticamente si hay sesión activa.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sesion = authService.obtenerSesion();

  if (!sesion) {
    return next(req);
  }

  const reqConHeaders = req.clone({
    setHeaders: {
      'x-usuario-id': String(sesion.userId),
      'x-usuario-rol': sesion.userRol
    }
  });

  return next(reqConHeaders);
};