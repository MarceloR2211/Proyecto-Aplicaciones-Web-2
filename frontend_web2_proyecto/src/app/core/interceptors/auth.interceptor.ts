import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor de Autenticación para el Sistema ISP.
 * Recupera explícitamente el ID y el Rol del usuario desde el LocalStorage
 * e inyecta las cabeceras requeridas por el Backend para evitar errores 403.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Recuperar la sesión persistida
  const sesionRaw = localStorage.getItem('isp_sesion');

  if (sesionRaw) {
    try {
      const sesion = JSON.parse(sesionRaw);
      const userId = sesion.userId;
      const userRol = sesion.userRol;

      // Inyectar cabeceras x-usuario-id y x-usuario-rol
      const reqClonada = req.clone({
        setHeaders: {
          'x-usuario-id': String(userId),
          'x-usuario-rol': String(userRol)
        }
      });
      return next(reqClonada);
    } catch (e) {
      console.error('Error al parsear la sesión en el interceptor:', e);
    }
  }

  // Si no hay sesión, continuar con la petición original
  return next(req);
};
