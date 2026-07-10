import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultasService } from '../../core/services/consultas.service';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';
import { FooterComponent } from '../views-internet/components/footer/footer';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
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
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.pattern(/^\d{9}$/)],
    motivo_consulta: ['', [Validators.required, Validators.minLength(5)]]
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
    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorMsg.set(null);
    this.exitoMsg.set(null);

    this.consultasService.enviarConsulta(this.consultaForm.getRawValue()).subscribe({
      next: (res) => {
        this.enviando.set(false);

        if (res.error) {
          this.errorMsg.set(res.message);
          return;
        }

        this.exitoMsg.set(res.message);
        this.consultaForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        this.errorMsg.set(err.error?.message ?? 'No se pudo enviar tu consulta. Intenta nuevamente.');
      }
    });
  }
}