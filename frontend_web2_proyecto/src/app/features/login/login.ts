import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { FooterComponent } from '../views-internet/components/footer/footer';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';

/**
 * Impide ingresar únicamente espacios.
 */
const noSoloEspaciosValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const valor = String(control.value ?? '');

  if (valor.length > 0 && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
};

/**
 * Comprueba que la contraseña y su confirmación coincidan.
 */
const passwordsCoincidenValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmarPassword = control.get('confirmar_password')?.value;

  if (!password || !confirmarPassword) {
    return null;
  }

  return password === confirmarPassword
    ? null
    : { passwordsNoCoinciden: true };
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  modo = signal<'login' | 'registro'>('login');
  cargando = signal(false);

  errorMsg = signal<string | null>(null);
  exitoRegistro = signal<string | null>(null);

  mostrarPasswordLogin = signal(false);
  mostrarPasswordRegistro = signal(false);
  mostrarConfirmacion = signal(false);

  /**
   * Formulario para iniciar sesión.
   */
  loginForm = this.fb.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/),
        noSoloEspaciosValidator
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(72)
      ]
    ]
  });

  /**
   * Formulario para registrar una cuenta.
   */
  registroForm = this.fb.nonNullable.group(
    {
      nombre_completo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
          Validators.pattern(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
          ),
          noSoloEspaciosValidator
        ]
      ],

      dni: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ],

      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{9}$/)
        ]
      ],

      ubigeo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/)
        ]
      ],

      zona: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
          Validators.pattern(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,#°/()-]+$/
          ),
          noSoloEspaciosValidator
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9._-]+$/),
          noSoloEspaciosValidator
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(72),

          /*
           * Debe contener:
           * - Una minúscula
           * - Una mayúscula
           * - Un número
           * - Un carácter especial
           */
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/
          )
        ]
      ],

      confirmar_password: [
        '',
        [
          Validators.required
        ]
      ]
    },
    {
      validators: passwordsCoincidenValidator
    }
  );

  cambiarModo(nuevoModo: 'login' | 'registro'): void {
    this.modo.set(nuevoModo);

    this.errorMsg.set(null);
    this.exitoRegistro.set(null);

    this.mostrarPasswordLogin.set(false);
    this.mostrarPasswordRegistro.set(false);
    this.mostrarConfirmacion.set(false);
  }

  loginCampoInvalido(campo: 'username' | 'password'): boolean {
    const control = this.loginForm.controls[campo];

    return control.invalid && (control.touched || control.dirty);
  }

  loginCampoValido(campo: 'username' | 'password'): boolean {
    const control = this.loginForm.controls[campo];

    return control.valid && control.touched;
  }

  registroCampoInvalido(
    campo:
      | 'nombre_completo'
      | 'dni'
      | 'telefono'
      | 'ubigeo'
      | 'zona'
      | 'username'
      | 'email'
      | 'password'
  ): boolean {
    const control = this.registroForm.controls[campo];

    return control.invalid && (control.touched || control.dirty);
  }

  registroCampoValido(
    campo:
      | 'nombre_completo'
      | 'dni'
      | 'telefono'
      | 'ubigeo'
      | 'zona'
      | 'username'
      | 'email'
      | 'password'
  ): boolean {
    const control = this.registroForm.controls[campo];

    return control.valid && control.touched;
  }

  confirmacionInvalida(): boolean {
    const control =
      this.registroForm.controls.confirmar_password;

    return Boolean(
      (control.invalid ||
        this.registroForm.hasError('passwordsNoCoinciden')) &&
      (control.touched || control.dirty)
    );
  }

  confirmacionValida(): boolean {
    const control =
      this.registroForm.controls.confirmar_password;

    return Boolean(
      control.valid &&
      control.touched &&
      !this.registroForm.hasError('passwordsNoCoinciden')
    );
  }

  /**
   * Elimina letras y caracteres especiales de los campos numéricos.
   */
  soloNumeros(
    event: Event,
    campo: 'dni' | 'telefono' | 'ubigeo',
    longitudMaxima: number
  ): void {
    const input = event.target as HTMLInputElement;

    const valorNumerico = input.value
      .replace(/\D/g, '')
      .slice(0, longitudMaxima);

    input.value = valorNumerico;

    this.registroForm.controls[campo].setValue(valorNumerico);
    this.registroForm.controls[campo].markAsDirty();
  }

  onSubmitLogin(): void {
    this.errorMsg.set(null);
    this.exitoRegistro.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.errorMsg.set(
        'Completa correctamente tu usuario y contraseña.'
      );

      return;
    }

    const valores = this.loginForm.getRawValue();

    const credenciales = {
      username: valores.username.trim(),
      password: valores.password
    };

    this.cargando.set(true);

    this.authService
      .login(credenciales)
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.error) {
            this.errorMsg.set(
              res.message || 'Usuario o contraseña incorrectos.'
            );

            return;
          }

          const destino =
            res.user.rol === 'admin'
              ? '/dashboard-admin'
              : '/dashboard-cliente';

          this.router.navigate([destino]);
        },

        error: (err: HttpErrorResponse) => {
          console.error('Error al iniciar sesión:', err);

          this.errorMsg.set(
            err.error?.message ??
              'No se pudo conectar con el servidor.'
          );
        }
      });
  }

  onSubmitRegistro(): void {
    this.errorMsg.set(null);
    this.exitoRegistro.set(null);

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();

      this.errorMsg.set(
        'Revisa y completa correctamente todos los campos del registro.'
      );

      return;
    }

    const valores = this.registroForm.getRawValue();

    /*
     * Se excluye confirmar_password porque el backend no
     * necesita recibir ese campo.
     */
    const payload = {
      username: valores.username.trim(),

      password: valores.password,

      nombre_completo: valores.nombre_completo
        .trim()
        .replace(/\s+/g, ' '),

      email: valores.email
        .trim()
        .toLowerCase(),

      dni: valores.dni.trim(),

      ubigeo: valores.ubigeo.trim(),

      zona: valores.zona
        .trim()
        .replace(/\s+/g, ' '),

      telefono: valores.telefono.trim()
    };

    this.cargando.set(true);

    this.authService
      .registrar(payload)
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.error) {
            this.errorMsg.set(
              res.message || 'No se pudo crear la cuenta.'
            );

            return;
          }

          const usernameRegistrado = payload.username;

          this.registroForm.reset();

          this.loginForm.reset({
            username: usernameRegistrado,
            password: ''
          });

          this.modo.set('login');

          this.exitoRegistro.set(
            'Registro exitoso. Ahora puedes iniciar sesión.'
          );
        },

        error: (err: HttpErrorResponse) => {
          console.error('Error al registrar usuario:', err);

          this.errorMsg.set(
            err.error?.message ??
              'No se pudo registrar el usuario.'
          );
        }
      });
  }
}