import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';
import { FooterComponent } from '../views-internet/components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ===== Estado UI =====
  modo = signal<'login' | 'registro'>('login');
  cargando = signal(false);
  errorMsg = signal<string | null>(null);
  exitoRegistro = signal<string | null>(null);

  // ===== Formularios =====
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  registroForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre_completo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    telefono: ['', Validators.pattern(/^\d{9}$/)],
    ubigeo: [''],
    zona: ['']
  });

  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo.set(modo);
    this.errorMsg.set(null);
    this.exitoRegistro.set(null);
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.cargando.set(false);

        if (res.error) {
          this.errorMsg.set(res.message);
          return;
        }

        if (res.user.mustChangePassword) {
          this.router.navigate(['/cambiar-password']);
          return;
        }

        const destino = res.user.rol === 'admin' ? '/dashboard-admin' : '/dashboard-cliente';
        this.router.navigate([destino]);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al iniciar sesión. Intenta nuevamente.');
      }
    });
  }

  onSubmitRegistro(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set(null);

    const payload = this.registroForm.getRawValue();

    this.authService.registrar(payload).subscribe({
      next: (res) => {
        this.cargando.set(false);

        if (res.error) {
          this.errorMsg.set(res.message);
          return;
        }

        alert('Cuenta creada exitosamente en PostgreSQL. Ya puedes iniciar sesión.');

        // Volvemos al modo login con el usuario recién creado precargado
        this.exitoRegistro.set('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
        this.loginForm.patchValue({ username: res.usuario.username, password: '' });
        this.registroForm.reset();
        this.modo.set('login');
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorMsg.set(err.error?.message ?? 'Error al registrar la cuenta. Intenta nuevamente.');
      }
    });
  }
}