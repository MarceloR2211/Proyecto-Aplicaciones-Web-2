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
      alert('Debes iniciar sesión para dejar una reseña.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.nuevoComentario.comentario) return;

    this.enviando.set(true);
    this.dataService.crearComentario(this.nuevoComentario).subscribe({
      next: () => {
        alert('Reseña enviada con éxito a PostgreSQL. Un administrador la revisará pronto.');
        this.nuevoComentario = { calificacion: 5, comentario: '' };
        this.enviando.set(false);
        this.cargarComentarios();
      },
      error: (err: any) => {
        console.error('Error al enviar reseña:', err);
        this.enviando.set(false);
      }
    });
  }

  getEstrellas(n: number) { return Array(n).fill(0); }
}
