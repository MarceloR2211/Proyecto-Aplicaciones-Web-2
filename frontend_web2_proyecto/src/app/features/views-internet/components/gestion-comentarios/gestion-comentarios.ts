import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternetDataService } from '../../services/internet-data.service';
import { Comentario } from '../../models/comentario.model';

@Component({
  selector: 'app-gestion-comentarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-comentarios.html',
  styleUrls: ['./gestion-comentarios.css']
})
export class GestionComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  isLoading = true;
  procesandoId: number | null = null;

  constructor(private dataService: InternetDataService) {}

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.isLoading = true;
    this.dataService.getComentariosPendientes().subscribe({
      next: (data) => {
        this.comentarios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar comentarios', err);
        this.isLoading = false;
      }
    });
  }

  aprobar(id: number): void {
    this.procesandoId = id;
    this.dataService.aprobarComentario(id).subscribe({
      next: (success) => {
        if (success) {
          this.comentarios = this.comentarios.filter(c => c.id !== id);
          alert('Comentario aprobado exitosamente.');
        }
        this.procesandoId = null;
      },
      error: () => this.procesandoId = null
    });
  }

  rechazar(id: number): void {
    if (!confirm('¿Está seguro de rechazar este comentario?')) return;

    this.procesandoId = id;
    this.dataService.rechazarComentario(id).subscribe({
      next: (success) => {
        if (success) {
          this.comentarios = this.comentarios.filter(c => c.id !== id);
          alert('Comentario rechazado.');
        }
        this.procesandoId = null;
      },
      error: () => this.procesandoId = null
    });
  }

  getEstrellas(count: number): number[] {
    return Array(count).fill(0);
  }
}
