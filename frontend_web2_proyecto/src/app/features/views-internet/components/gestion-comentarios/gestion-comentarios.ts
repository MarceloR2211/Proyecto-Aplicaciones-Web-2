import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { Comentario } from '../../models/comentario.model';

@Component({
  selector: 'app-gestion-comentarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-comentarios.html',
  styleUrls: ['./gestion-comentarios.css']
})
export class GestionComentariosComponent implements OnInit {
  private dataService = inject(InternetDataService);

  comentarios: Comentario[] = [];
  isLoading = true;
  procesandoId: number | null = null;

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
      error: () => this.isLoading = false
    });
  }

  cambiarEstado(id: number, nuevoEstado: 'aprobado' | 'rechazado'): void {
    this.procesandoId = id;
    this.dataService.actualizarEstadoComentario(id, nuevoEstado).subscribe({
      next: (success) => {
        if (success) {
          this.comentarios = this.comentarios.filter(c => c.id !== id);
          alert(`Comentario ${nuevoEstado} con éxito.`);
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
