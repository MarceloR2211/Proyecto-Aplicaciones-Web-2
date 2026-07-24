import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { ConsultasService } from '../../core/services/consultas.service';
import { FooterComponent } from '../views-internet/components/footer/footer';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';

/**
 * Evita que un campo contenga únicamente espacios.
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
  selector: 'app-consultas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './consultas.html',
  styleUrl: './consultas.scss'
})
export class Consultas implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly consultasService = inject(ConsultasService);
  private readonly route = inject(ActivatedRoute);

  enviando = signal(false);
  exitoMsg = signal<string | null>(null);
  errorMsg = signal<string | null>(null);

  consultaForm = this.fb.nonNullable.group({
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

    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{8}$/)
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
    const plan = this.route.snapshot.queryParamMap.get('plan');

    if (plan) {
      this.consultaForm.patchValue({
        motivo_consulta: `Interesado en el plan: ${plan}`
      });
    }
  }

  onSubmit(): void {
    this.exitoMsg.set(null);
    this.errorMsg.set(null);

    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();

      this.errorMsg.set(
        'Revisa y completa correctamente todos los campos obligatorios.'
      );

      return;
    }

    const valores = this.consultaForm.getRawValue();

    const datosConsulta = {
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

    this.enviando.set(true);

    this.consultasService
      .enviarConsulta(datosConsulta)
      .pipe(
        finalize(() => {
          this.enviando.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.error) {
            this.errorMsg.set(
              res.message || 'No se pudo registrar la consulta.'
            );

            return;
          }

          this.exitoMsg.set(
            res.message || 'Tu consulta fue enviada correctamente.'
          );

          this.consultaForm.reset();

          setTimeout(() => {
            this.exitoMsg.set(null);
          }, 5000);
        },

        error: (err: HttpErrorResponse) => {
          console.error('Error al enviar la consulta:', err);

          this.errorMsg.set(
            err.error?.message ??
              'No se pudo enviar tu consulta. Intenta nuevamente.'
          );
        }
      });
  }
}