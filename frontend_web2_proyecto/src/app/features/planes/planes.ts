import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanesService } from '../../core/services/planes.service';
import { Plan } from '../../core/models/plan.model';
import { NavbarComponent } from '../views-internet/components/navbar/navbar';
import { FooterComponent } from '../views-internet/components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
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