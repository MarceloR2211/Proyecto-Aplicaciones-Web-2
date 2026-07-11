import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
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
  private http = inject(HttpClient);

  metricas?: MetricaServicio;
  planes: Plan[] = [];
  usuarios: Usuario[] = [];
  comentarios: Comentario[] = [];
  consultas: any[] = [];

  tickets: Ticket[] = [];
  activeTab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' | 'tickets' | 'consultas' = 'resumen';
  isLoading = true;

  // Operaciones CRUD Planes
  nuevoPlan: Partial<Plan> = { nombre_plan: '', tipo_plan: 'residencial', velocidad: '', precio: 0, descripcion: '' };
  editandoPlanId: number | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;

    // forkJoin para cargar todos los datos reales de PostgreSQL en paralelo
    forkJoin({
      metricas: this.dataService.getMetricasAdmin(),
      planes: this.dataService.getPlanes(),
      usuarios: this.dataService.getUsers(),
      tickets: this.dataService.getTicketsAdmin(),
      consultas: this.dataService.getConsultas(),
      comentarios: this.dataService.getComentariosPendientes()
    }).subscribe({
      next: (res) => {
        this.metricas = res.metricas;
        this.planes = res.planes;
        this.usuarios = res.usuarios;
        this.tickets = res.tickets;
        this.consultas = res.consultas;
        this.comentarios = res.comentarios;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos administrativos:', err);
        this.isLoading = false;
      }
    });
  }

  setTab(tab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' | 'tickets' | 'consultas'): void {
    this.activeTab = tab;
  }

  crearOActualizarPlan(): void {
    if (this.editandoPlanId) {
      this.dataService.updatePlan(this.editandoPlanId, this.nuevoPlan).subscribe({
        next: () => {
          alert('Plan actualizado con éxito.');
          this.cancelarEdicionPlan();
          document.getElementById('closePlanModal')?.click();
          this.cargarDatos();
        }
      });
    } else {
      this.dataService.createPlan(this.nuevoPlan).subscribe({
        next: () => {
          alert('Nuevo plan registrado en PostgreSQL.');
          this.nuevoPlan = { nombre_plan: '', tipo_plan: 'residencial', velocidad: '', precio: 0, descripcion: '' };
          document.getElementById('closePlanModal')?.click();
          this.cargarDatos();
        }
      });
    }
  }

  editarPlan(plan: Plan): void {
    this.editandoPlanId = plan.id;
    this.nuevoPlan = { ...plan };
  }

  cancelarEdicionPlan(): void {
    this.editandoPlanId = null;
    this.nuevoPlan = { nombre_plan: '', tipo_plan: 'residencial', velocidad: '', precio: 0, descripcion: '' };
  }

  // Sistema de Confirmación por Modal
  confirmMessage = '';
  private pendingAction: (() => void) | null = null;

  abrirConfirmacion(msg: string, action: () => void): void {
    this.confirmMessage = msg;
    this.pendingAction = action;
    (window as any).bootstrap?.Modal.getOrCreateInstance(document.getElementById('confirmModal')).show();
  }

  ejecutarConfirmacion(): void {
    if (this.pendingAction) this.pendingAction();
    this.pendingAction = null;
    (window as any).bootstrap?.Modal.getOrCreateInstance(document.getElementById('confirmModal')).hide();
  }

  // Operaciones CRUD Planes
  eliminarPlan(id: number): void {
    this.abrirConfirmacion('¿Está seguro de eliminar este plan de forma permanente?', () => {
      this.dataService.deletePlan(id).subscribe({
        next: () => {
          alert('Plan eliminado con éxito.');
          this.cargarDatos();
        },
        error: () => alert('Error al eliminar el plan. Verifique dependencias en la BD.')
      });
    });
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
    this.abrirConfirmacion('¿Eliminar usuario? Esta acción es irreversible.', () => {
      this.dataService.deleteUser(id).subscribe({
        next: () => {
          alert('Usuario eliminado.');
          this.cargarDatos();
        },
        error: () => alert('Error al eliminar usuario.')
      });
    });
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

  convertirConsulta(id: number): void {
    this.dataService.updateConsultaEstado(id, 'convertido').subscribe({
       next: () => {
         alert('Consulta marcada como convertida.');
         this.cargarDatos();
       }
    });
  }

  asignarPlanManual(usuarioId: number, planId: string): void {
    if (!planId) return;

    // Simulación de lógica de asignación con cálculo de vencimiento (30 días)
    const fechaInicio = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaInicio.getDate() + 30);

    const payload = {
      usuario_id: usuarioId,
      plan_id: Number(planId),
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      estado_contrato: 'activo'
    };

    // Petición real al backend
    this.http.post<any>(`${environment.apiUrl}/contratos`, payload).subscribe({
      next: () => {
        alert(`Plan asignado con éxito. Fecha de vencimiento calculada: ${fechaVencimiento.toLocaleDateString()}`);
        this.cargarDatos();
      },
      error: () => alert('Error al asignar el contrato.')
    });
  }
}
