import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { InternetDataService } from '../../services/internet-data.service';
import { Plan } from '../../models/metrica.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

/**
 * Evita que un campo sea completado únicamente con espacios.
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

@Component({
  selector: 'app-index-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './index-main.html',
  styleUrls: ['./index-main.css']
})
export class IndexMainComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(InternetDataService);
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  planes$: Observable<Plan[]> | null = null;

  isSubmitting = signal(false);

  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  consultaForm = this.fb.nonNullable.group({
    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]
    ],

    nombre: [
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

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    ],

    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{9}$/)
      ]
    ],

    motivo_consulta: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
        noSoloEspaciosValidator
      ]
    ]
  });

  ngOnInit(): void {
    this.planes$ = this.dataService.getPlanes();
  }

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.consultaForm.get(nombreCampo);

    return Boolean(
      campo &&
      campo.invalid &&
      (campo.touched || campo.dirty)
    );
  }

  campoValido(nombreCampo: string): boolean {
    const campo = this.consultaForm.get(nombreCampo);

    return Boolean(
      campo &&
      campo.valid &&
      campo.touched
    );
  }

  /**
   * Elimina letras y caracteres especiales del DNI y teléfono.
   */
  soloNumeros(
    event: Event,
    controlName: 'dni' | 'telefono',
    maxLength: number
  ): void {
    const input = event.target as HTMLInputElement;

    const valorNumerico = input.value
      .replace(/\D/g, '')
      .slice(0, maxLength);

    input.value = valorNumerico;

    this.consultaForm.controls[controlName].setValue(valorNumerico);
    this.consultaForm.controls[controlName].markAsDirty();
  }

  enviarConsulta(): void {
    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();

      this.mostrarFeedback(
        'Formulario incompleto',
        'Revisa y completa correctamente todos los campos obligatorios.',
        false
      );

      return;
    }

    const valores = this.consultaForm.getRawValue();

    const consulta = {
      dni: valores.dni.trim(),

      nombre: valores.nombre
        .trim()
        .replace(/\s+/g, ' '),

      email: valores.email
        .trim()
        .toLowerCase(),

      telefono: valores.telefono.trim(),

      motivo_consulta: valores.motivo_consulta
        .trim()
        .replace(/\s+/g, ' ')
    };

    this.isSubmitting.set(true);

    this.dataService
      .registrarConsulta(consulta)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe({
        next: (success) => {
          if (!success) {
            this.mostrarFeedback(
              'No se pudo enviar',
              'No se pudo registrar la consulta. Intenta nuevamente.',
              false
            );

            return;
          }

          this.mostrarFeedback(
            'Consulta enviada',
            '¡Gracias! Nos pondremos en contacto contigo pronto.',
            true
          );

          this.consultaForm.reset();
        },

        error: (err: any) => {
          console.error('Error al enviar la consulta:', err);

          this.mostrarFeedback(
            'Error',
            err.error?.message ||
              'Ocurrió un error al enviar la consulta.',
            false
          );
        }
      });
  }

  mostrarFeedback(
    title: string,
    msg: string,
    success: boolean
  ): void {
    this.feedbackTitle = title;
    this.feedbackMessage = msg;
    this.isSuccess = success;

    const elementoModal =
      document.getElementById('feedbackModal');

    if (
      elementoModal &&
      (window as any).bootstrap
    ) {
      const modal = new (window as any).bootstrap.Modal(
        elementoModal
      );

      modal.show();
    }
  }

  irMiCuenta(): void {
    const usuario = this.authService.usuarioActual();

    if (usuario?.rol === 'admin') {
      this.router.navigate(['/dashboard-admin']);
      return;
    }

    this.router.navigate(['/dashboard-cliente']);
  }
}