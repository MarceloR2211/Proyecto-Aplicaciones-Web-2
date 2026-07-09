import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente, Plan, Factura, Ticket } from '../models/metrica.model';
import { Usuario } from '../../../core/models/auth.model';

/**
 * Servicio Angular para la gestión de datos de Internet
 * Conectado a la base de datos relacional del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class InternetDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ===== PLANES (CRUD) =====

  getPlanes(): Observable<Plan[]> {
    return this.http.get<{error: boolean, planes: Plan[]}>(`${this.baseUrl}/planes`).pipe(
      map(res => res.planes.map(p => ({
        ...p,
        precio: Number(p.precio),
        destacado: p.nombre_plan.toLowerCase().includes('pro') || p.id === 2
      })))
    );
  }

  createPlan(plan: Partial<Plan>): Observable<any> {
    return this.http.post(`${this.baseUrl}/planes`, plan);
  }

  updatePlan(id: number, plan: Partial<Plan>): Observable<any> {
    return this.http.put(`${this.baseUrl}/planes/${id}`, plan);
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/planes/${id}`);
  }

  // ===== USUARIOS (CRUD ADM) =====

  getUsers(): Observable<Usuario[]> {
    return this.http.get<{error: boolean, usuarios: Usuario[]}>(`${this.baseUrl}/usuarios`).pipe(
      map(res => res.usuarios)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  // ===== TICKETS (CRUD ADM) =====

  getTicketsAdmin(): Observable<Ticket[]> {
    return this.http.get<{error: boolean, tickets: Ticket[]}>(`${this.baseUrl}/tickets`).pipe(
      map(res => res.tickets)
    );
  }

  updateTicketStatus(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/tickets/${id}`, { estado });
  }

  // ===== COMENTARIOS (MODERACIÓN) =====

  getComentariosPendientes(): Observable<Comentario[]> {
    return this.http.get<{error: boolean, comentarios: ComentarioRaw[]}>(`${this.baseUrl}/comentarios`).pipe(
      map(res => res.comentarios
        .filter(c => c.estado === 'pendiente')
        .map(c => ({
          id: c.id,
          usuario_id: c.usuario_id,
          usuario: c.nombre_usuario || `Usuario ${c.usuario_id}`,
          tipoCliente: c.rol || 'usuario',
          estrellas: c.calificacion,
          texto: c.comentario,
          fecha: c.fecha_creacion,
          estado: c.estado,
          planContratado: c.nombre_plan || 'Plan Hogar'
        } as Comentario))
      )
    );
  }

  actualizarEstadoComentario(id: number, estado: 'aprobado' | 'rechazado'): Observable<boolean> {
    return this.http.put<{error: boolean}>(`${this.baseUrl}/comentarios/${id}`, { estado }).pipe(
      map(res => !res.error)
    );
  }

  // ===== DASHBOARDS & MÉTRICAS =====

  getMetricasAdmin(): Observable<MetricaServicio> {
    return this.http.get<{error: boolean, metrics: MetricsRaw}>(`${this.baseUrl}/dashboard/admin`).pipe(
      map(res => ({
        clientesActivos: res.metrics.totalClientes,
        serviciosActivos: res.metrics.serviciosActivos,
        ticketsPendientes: res.metrics.ticketsPendientes,
        porCobrar: res.metrics.porCobrar,
        nodosEstado: [
          { id: 1, nombre: 'Nodo Central', estado: 'Estable', ubicacion: 'Centro', cargaActual: 45 },
          { id: 2, nombre: 'Nodo Periferia', estado: 'Saturado', ubicacion: 'Norte', cargaActual: 88 }
        ]
      } as MetricaServicio))
    );
  }

  getDatosCliente(): Observable<DatosCliente> {
    return this.http.get<{error: boolean, dashboard: DashboardRaw}>(`${this.baseUrl}/dashboard/cliente`).pipe(
      map(res => ({
        perfil: {
          nombre: res.dashboard.perfil?.nombre || 'Cliente',
          email: res.dashboard.perfil?.email || ''
        },
        servicio: {
          plan: res.dashboard.servicio.plan,
          velocidad: res.dashboard.servicio.velocidad,
          precio: Number(res.dashboard.servicio.precio),
          estado: res.dashboard.servicio.estado,
          fechaInicio: res.dashboard.servicio.fechaInicio
        },
        facturas: res.dashboard.facturas.map(f => ({
          ...f,
          monto: Number(f.monto)
        })),
        tickets: res.dashboard.tickets
      } as DatosCliente))
    );
  }

  // ===== CONSULTAS =====

  registrarConsulta(datos: { nombre: string, email: string, telefono: string, mensaje: string }): Observable<boolean> {
    return this.http.post<{error: boolean}>(`${this.baseUrl}/consultas`, {
      ...datos,
      asunto: 'Interés en Plan de Internet',
      estado: 'pendiente'
    }).pipe(map(res => !res.error));
  }
}

/**
 * Interfaces auxiliares para evitar 'any' en el mapeo
 */
interface ComentarioRaw {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  rol: string;
  calificacion: number;
  comentario: string;
  fecha_creacion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  nombre_plan: string;
}

interface MetricsRaw {
  totalClientes: number;
  serviciosActivos: number;
  ticketsPendientes: number;
  porCobrar: number;
}

interface DashboardRaw {
  perfil: { nombre: string, email: string };
  servicio: { plan: string, velocidad: string, precio: string | number, estado: string, fechaInicio: string };
  facturas: Factura[];
  tickets: Ticket[];
}
