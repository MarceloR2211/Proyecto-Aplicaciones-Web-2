import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanesService } from '../../core/services/planes.service';
import { Plan } from '../../core/models/plan.model';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [],
  templateUrl: './planes.html',
  styleUrl: './planes.scss'
})
export class Planes implements OnInit {
  private readonly planesService = inject(PlanesService);

  planes = signal<Plan[]>([]);
  cargando = signal(true);
  errorMsg = signal<string | null>(null);

  ngOnInit(): void {
    this.planesService.obtenerTodos().subscribe({
      next: (res) => {
        this.planes.set(res.planes);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.message ?? 'No se pudieron cargar los planes.');
        this.cargando.set(false);
      }
    });
  }
}