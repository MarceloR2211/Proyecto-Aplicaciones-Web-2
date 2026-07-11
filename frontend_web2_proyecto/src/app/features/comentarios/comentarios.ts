import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InternetDataService } from '../views-internet/services/internet-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Comentario } from '../views-internet/models/comentario.model';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';
import { FooterComponent } from '../views-internet/components/footer/footer';

@Component({
  selector: 'app-comentarios-public',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './comentarios.html',
  styleUrls: ['./comentarios.css']
})
export class ComentariosPublic implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);
  private router = inject(Router);

  comentarios = signal<Comentario[]>([]);
  nuevoComentario = { calificacion: 5, comentario: '' };
  enviando = signal(false);

  // Feedback UI
  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.dataService.getComentarios().subscribe((c: Comentario[]) => {
      this.comentarios.set(c.filter((x: Comentario) => x.estado === 'aprobado'));
    });
  }

  enviarComentario(): void {
    if (!this.authService.estaAutenticado()) {
      this.mostrarFeedback('Acceso Requerido', 'Debes iniciar sesión para dejar una reseña.', false);
      this.router.navigate(['/login']);
      return;
    }

    if (!this.nuevoComentario.comentario) return;

    this.enviando.set(true);
    this.dataService.crearComentario(this.nuevoComentario).subscribe({
      next: () => {
        this.enviando.set(false);
        this.mostrarFeedback('¡Gracias!', 'Tu reseña ha sido enviada para moderación.', true);
        this.nuevoComentario = { calificacion: 5, comentario: '' };
        this.cargarComentarios();
      },
      error: (err: any) => {
        this.enviando.set(false);
        this.mostrarFeedback('Error', err.error?.message || 'Hubo un fallo al enviar la reseña.', false);
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

  getEstrellas(n: number) { return Array(n).fill(0); }
}
