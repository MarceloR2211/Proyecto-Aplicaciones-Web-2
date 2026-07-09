import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegistroUsuarioRequest,
  RegistroUsuarioResponse,
  SesionActiva,
  Usuario
} from '../models/auth.model';

const SESION_KEY = 'isp_sesion';
const USUARIO_KEY = 'isp_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Estado reactivo de sesión, inicializado desde localStorage
  private readonly usuarioSignal = signal<Usuario | null>(this.leerUsuarioGuardado());
  readonly usuarioActual = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioSignal() !== null);

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    // ===== Mock Logic for Test Accounts =====
    const { username, password } = credenciales;
    if (password === '123456' && (username === 'admin' || username === 'user')) {
      const mockUser: Usuario = {
        id: username === 'admin' ? 999 : 888,
        username: username,
        nombre_completo: username === 'admin' ? 'Administrador de Pruebas' : 'Usuario de Pruebas',
        rol: username === 'admin' ? 'admin' : 'usuario',
        mustChangePassword: false
      };

      const mockResponse: LoginResponse = {
        error: false,
        message: 'Login exitoso (Mock Account)',
        simulatedSession: { userId: mockUser.id, userRol: mockUser.rol },
        user: mockUser
      };

      this.guardarSesion(mockResponse.simulatedSession, mockResponse.user);
      return of(mockResponse);
    }

    // Real API call if not a mock account
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, credenciales)
      .pipe(
        tap((res) => {
          if (!res.error) {
            this.guardarSesion(res.simulatedSession, res.user);
          }
        })
      );
  }

  registrar(datos: RegistroUsuarioRequest): Observable<RegistroUsuarioResponse> {
    return this.http.post<RegistroUsuarioResponse>(`${this.baseUrl}/usuarios`, datos);
  }

  changePassword(datos: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(
      `${this.baseUrl}/auth/change-password`,
      datos
    );
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}/auth/logout`, {}).pipe(
      tap(() => this.limpiarSesion())
    );
  }

  // ===== Manejo de sesión en localStorage =====

  guardarSesion(sesion: SesionActiva, usuario: Usuario): void {
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  obtenerSesion(): SesionActiva | null {
    const raw = localStorage.getItem(SESION_KEY);
    return raw ? (JSON.parse(raw) as SesionActiva) : null;
  }

  private leerUsuarioGuardado(): Usuario | null {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }

  limpiarSesion(): void {
    localStorage.removeItem(SESION_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioSignal.set(null);
  }
}