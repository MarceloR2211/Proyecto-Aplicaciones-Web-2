// ===== LOGIN =====
export interface LoginRequest {
  username: string;
  password: string;
}

export interface Usuario {
  id: number;
  username: string;
  nombre_completo: string;
  rol: 'admin' | 'usuario';
  mustChangePassword: boolean;
}

export interface LoginResponse {
  error: boolean;
  message: string;
  simulatedSession: {
    userId: number;
    userRol: string;
  };
  user: Usuario;
}

// Lo que persistimos en localStorage tras un login exitoso
export interface SesionActiva {
  userId: number;
  userRol: string;
}

// ===== CAMBIO DE CONTRASEÑA =====
export interface ChangePasswordRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  error: boolean;
  message: string;
  redirectTo: string;
}

// ===== LOGOUT =====
export interface LogoutResponse {
  error: boolean;
  message: string;
  clearHeaders: boolean;
  redirectTo: string;
}

// ===== REGISTRO DE USUARIOS =====
export interface RegistroUsuarioRequest {
  username: string;
  password: string;
  nombre_completo: string;
  email: string;
  dni?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  ubigeo?: string;
  zona?: string;
  rol?: 'admin' | 'usuario'; // por defecto 'usuario' si se omite
}

export interface RegistroUsuarioResponse {
  error: boolean;
  message: string;
  usuario: {
    id: number;
    username: string;
    dni: string;
    nombre_completo: string;
    email: string;
    rol: string;
  };
}