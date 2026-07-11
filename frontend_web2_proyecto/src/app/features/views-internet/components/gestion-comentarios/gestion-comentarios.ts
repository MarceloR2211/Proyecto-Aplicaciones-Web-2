import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { Comentario } from '../../models/comentario.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-gestion-comentarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './gestion-comentarios.html',
  styleUrls: ['./gestion-comentarios.css']
})
export class GestionComentariosComponent implements OnInit {
  private dataService = inject(InternetDataService);

  comentarios: Comentario[] = [];
  isLoading = signal(true);
  procesandoId = signal<number | null>(null);

  // Feedback UI
  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.isLoading.set(true);
    this.dataService.getComentariosPendientes().subscribe({
      next: (data: Comentario[]) => {
        this.comentarios = data;
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.mostrarFeedback('Error', err.error?.message || 'Error al cargar comentarios.', false);
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.procesandoId.set(id);
    this.dataService.actualizarEstadoComentario(id, nuevoEstado).subscribe({
      next: (success: any) => {
        if (success) {
          this.comentarios = this.comentarios.filter(c => c.id !== id);
          this.mostrarFeedback('Moderación', `Comentario ${nuevoEstado} con éxito.`, true);
        }
        this.procesandoId.set(null);
      },
      error: (err: any) => {
        this.procesandoId.set(null);
        this.mostrarFeedback('Error', err.error?.message || 'Error al moderar comentario.', false);
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

  getEstrellas(count: number): number[] {
    return Array(count).fill(0);
  }
}
