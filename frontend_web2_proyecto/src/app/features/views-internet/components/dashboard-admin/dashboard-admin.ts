import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MetricaServicio, Plan } from '../../models/metrica.model';
import { Comentario } from '../../models/comentario.model';
import { Usuario } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);

  metricas?: MetricaServicio;
  planes: Plan[] = [];
  usuarios: Usuario[] = [];
  comentarios: Comentario[] = [];

  activeTab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' = 'resumen';
  isLoading = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.dataService.getMetricasAdmin().subscribe(m => this.metricas = m);
    this.dataService.getPlanes().subscribe(p => this.planes = p);
    this.dataService.getUsers().subscribe(u => this.usuarios = u);
    this.dataService.getComentariosPendientes().subscribe(c => {
      this.comentarios = c;
      this.isLoading = false;
    });
  }

  setTab(tab: 'resumen' | 'planes' | 'usuarios' | 'comentarios'): void {
    this.activeTab = tab;
  }

  // Operaciones CRUD Simples (Llamando al servicio)
  eliminarPlan(id: number): void {
    if (confirm('¿Eliminar plan?')) {
      this.dataService.deletePlan(id).subscribe(() => this.cargarDatos());
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Eliminar usuario?')) {
      this.dataService.deleteUser(id).subscribe(() => this.cargarDatos());
    }
  }

  moderarComentario(id: number, estado: 'aprobado' | 'rechazado'): void {
    this.dataService.actualizarEstadoComentario(id, estado).subscribe(() => this.cargarDatos());
  }
}
