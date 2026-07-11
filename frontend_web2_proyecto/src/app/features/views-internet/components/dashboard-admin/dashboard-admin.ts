import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
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
  consultas: any[] = [];
  consultaSeleccionada: any = null;

  tickets: Ticket[] = [];
  activeTab: 'resumen' | 'planes' | 'usuarios' | 'comentarios' | 'tickets' | 'consultas' = 'resumen';
  isLoading = true;

  nuevoPlan: Partial<Plan> = { nombre_plan: '', tipo_plan: 'residencial', velocidad: '', precio: 0, descripcion: '' };
  editandoPlanId: number | null = null;

  // Estado para modales de feedback
  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
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
      error: () => {
        this.mostrarFeedback('Error', 'No se pudieron cargar los datos del servidor.', false);
        this.isLoading = false;
      }
    });
  }

  setTab(tab: any): void {
    this.activeTab = tab;
  }

  verConsulta(consulta: any): void {
    this.consultaSeleccionada = consulta;
    this.abrirModal('consultaModal');
  }

  convertirConsulta(id: number): void {
    this.dataService.updateConsultaEstado(id, 'convertido').subscribe({
       next: () => {
         this.cargarDatos();
         this.mostrarFeedback('Éxito', 'La consulta ha sido marcada como atendida.', true);
       },
       error: () => this.mostrarFeedback('Error', 'Hubo un fallo al actualizar la consulta.', false)
    });
  }

  moderarComentario(id: number, estado: 'aprobado' | 'rechazado'): void {
    this.dataService.actualizarEstadoComentario(id, estado).subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarFeedback('Moderación', `Comentario ${estado} correctamente.`, true);
      },
      error: () => this.mostrarFeedback('Error', 'No se pudo procesar la moderación.', false)
    });
  }

  eliminarPlan(id: number): void {
    if(confirm('¿Está seguro de eliminar este plan?')) {
      this.dataService.deletePlan(id).subscribe({
        next: () => {
          this.cargarDatos();
          this.mostrarFeedback('Eliminado', 'El plan ha sido removido del catálogo.', true);
        },
        error: () => this.mostrarFeedback('Error', 'No se pudo eliminar el plan.', false)
      });
    }
  }

  crearOActualizarPlan(): void {
    const obs = this.editandoPlanId
      ? this.dataService.updatePlan(this.editandoPlanId, this.nuevoPlan)
      : this.dataService.createPlan(this.nuevoPlan);

    obs.subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarFeedback('Guardado', 'Los cambios en el plan se han persistido en la BD.', true);
        this.nuevoPlan = { nombre_plan: '', tipo_plan: 'residencial', velocidad: '', precio: 0, descripcion: '' };
        this.editandoPlanId = null;
        this.cerrarModal('planModal');
      },
      error: () => this.mostrarFeedback('Error', 'Error al guardar el plan.', false)
    });
  }

  // Helpers de Modales
  private abrirModal(id: string): void {
    const el = document.getElementById(id);
    if (el && (window as any).bootstrap) {
      const m = new (window as any).bootstrap.Modal(el);
      m.show();
    }
  }

  private cerrarModal(id: string): void {
    const el = document.getElementById(id);
    if (el && (window as any).bootstrap) {
      const m = (window as any).bootstrap.Modal.getInstance(el);
      m?.hide();
    }
  }

  private mostrarFeedback(title: string, msg: string, success: boolean): void {
    this.feedbackTitle = title;
    this.feedbackMessage = msg;
    this.isSuccess = success;
    this.abrirModal('feedbackModal');
  }
}
