import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Plan } from '../../models/metrica.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-index-main',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './index-main.html',
  styleUrls: ['./index-main.css']
})
export class IndexMainComponent implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);
  private router = inject(Router);

  planes$: Observable<Plan[]> | null = null;

  // Formulario de consulta
  consulta = {
    dni: '',
    nombre: '',
    email: '',
    telefono: '',
    motivo_consulta: ''
  };

  isSubmitting = signal(false);

  // Feedback UI
  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.planes$ = this.dataService.getPlanes();
  }

  enviarConsulta(): void {
    if (!this.consulta.dni || !this.consulta.nombre || !this.consulta.email) {
      this.mostrarFeedback('Campos Obligatorios', 'Por favor complete DNI, Nombre y Email.', false);
      return;
    }

    this.isSubmitting.set(true);
    this.dataService.registrarConsulta(this.consulta).subscribe({
      next: (success) => {
        this.isSubmitting.set(false);
        if (success) {
          this.mostrarFeedback('Consulta Enviada', '¡Gracias! Nos pondremos en contacto pronto.', true);
          this.consulta = { dni: '', nombre: '', email: '', telefono: '', motivo_consulta: '' };
        }
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.mostrarFeedback('Error', err.error?.message || 'Error al enviar la consulta.', false);
      }
    });
  }

  mostrarFeedback(title: string, msg: string, success: boolean): void {
    this.feedbackTitle = title;
    this.feedbackMessage = msg;
    this.isSuccess = success;
    const el = document.getElementById('feedbackModal');
    if (el && (window as any).bootstrap) {
      const m = new (window as any).bootstrap.Modal(el);
      m.show();
    }
  }

  irMiCuenta(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario?.rol === 'admin') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/dashboard-cliente']);
    }
  }
}
