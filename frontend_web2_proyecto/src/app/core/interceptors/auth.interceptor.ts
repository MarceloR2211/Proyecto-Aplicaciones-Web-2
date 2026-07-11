import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor de Autenticación para el Sistema ISP.
 * Recupera explícitamente el ID y el Rol del usuario desde el LocalStorage
 * e inyecta las cabeceras requeridas por el Backend.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo interceptar peticiones hacia nuestra API
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  const sesionRaw = localStorage.getItem('isp_sesion');

  if (sesionRaw) {
    try {
      const sesion = JSON.parse(sesionRaw);
      const userId = sesion.userId;
      const userRol = sesion.userRol;

      if (userId && userRol) {
        const reqClonada = req.clone({
          setHeaders: {
            'x-usuario-id': String(userId),
            'x-usuario-rol': String(userRol)
          }
        });
        return next(reqClonada);
      }
    } catch (e) {
      // Ignorar errores de parseo y continuar
    }
  }

  return next(req);
};
