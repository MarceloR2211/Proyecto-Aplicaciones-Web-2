import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MetricaServicio, Plan, Ticket } from '../../models/metrica.model';
import { Comentario } from '../../models/comentario.model';
import { Usuario } from '../../../../core/models/auth.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
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

  tickets: Ticket[] = [];
  activeTab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' | 'tickets' = 'resumen';
  isLoading = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.dataService.getMetricasAdmin().subscribe({
      next: m => this.metricas = m,
      error: () => {
        this.metricas = { clientesActivos: 120, serviciosActivos: 95, ticketsPendientes: 4, porCobrar: 1250, nodosEstado: [] };
      }
    });

    this.dataService.getPlanes().subscribe(p => this.planes = p);

    this.dataService.getUsers().subscribe({
      next: u => this.usuarios = u,
      error: () => {
        this.usuarios = [
          { id: 1, username: 'admin', nombre_completo: 'Admin Root', rol: 'admin', mustChangePassword: false },
          { id: 2, username: 'user1', nombre_completo: 'Juan Perez', rol: 'usuario', mustChangePassword: false },
          { id: 3, username: 'user2', nombre_completo: 'Maria Garcia', rol: 'usuario', mustChangePassword: false }
        ];
      }
    });

    this.dataService.getTicketsAdmin().subscribe({
      next: t => this.tickets = t,
      error: () => {
        this.tickets = [
          { id: 1, titulo: 'Falla Internet', descripcion: 'No tengo señal desde la mañana', estado: 'abierto', fecha_creacion: '2023-11-10' },
          { id: 2, titulo: 'Cambio Plan', descripcion: 'Quiero subir a 500 megas', estado: 'en_proceso', fecha_creacion: '2023-11-11' }
        ];
      }
    });

    this.dataService.getComentariosPendientes().subscribe({
      next: c => {
        this.comentarios = c;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  setTab(tab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' | 'tickets'): void {
    this.activeTab = tab;
  }

  // Operaciones CRUD Simples (Llamando al servicio)
  eliminarPlan(id: number): void {
    if (confirm('¿Está seguro de eliminar este plan de forma permanente?')) {
      this.dataService.deletePlan(id).subscribe({
        next: () => {
          alert('Plan eliminado con éxito.');
          this.cargarDatos();
        },
        error: () => alert('Error al eliminar el plan. Verifique dependencias en la BD.')
      });
    }
  }

  cambiarRolUsuario(id: number, nuevoRol: 'admin' | 'usuario'): void {
    this.dataService.updateUser(id, { rol: nuevoRol }).subscribe({
      next: () => {
        alert('Rol de usuario actualizado.');
        this.cargarDatos();
      },
      error: () => alert('Error al actualizar rol.')
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Eliminar usuario? Esta acción es irreversible.')) {
      this.dataService.deleteUser(id).subscribe({
        next: () => {
          alert('Usuario eliminado.');
          this.cargarDatos();
        },
        error: () => alert('Error al eliminar usuario.')
      });
    }
  }

  moderarComentario(id: number, estado: 'aprobado' | 'rechazado'): void {
    this.dataService.actualizarEstadoComentario(id, estado).subscribe({
      next: () => {
        alert(`Comentario ${estado}.`);
        this.cargarDatos();
      },
      error: () => alert('Error en la moderación.')
    });
  }

  actualizarEstadoTicket(id: number, estado: string): void {
    this.dataService.updateTicketStatus(id, estado).subscribe({
      next: () => {
        alert('Estado del ticket actualizado.');
        this.cargarDatos();
      },
      error: () => alert('Error al actualizar ticket.')
    });
  }
}
