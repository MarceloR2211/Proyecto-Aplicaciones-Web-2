import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente, Plan, Factura, Ticket } from '../models/metrica.model';
import { Usuario } from '../../../core/models/auth.model';

/**
 * Servicio Angular para la gestión de datos de Internet
 * Conectado a la base de datos relacional del backend.
 * Alineado 100% con los controladores y modelos de PostgreSQL.
 */
@Injectable({
  providedIn: 'root'
})
export class InternetDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly REQ_TIMEOUT = 5000;

  // ===== PLANES (CRUD) - /api/planes =====

  getPlanes(): Observable<Plan[]> {
    return this.http.get<{error: boolean, planes: Plan[]}>(`${this.baseUrl}/planes`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.planes.map((p: Plan) => ({
        ...p,
        precio: Number(p.precio),
        destacado: p.nombre_plan.toLowerCase().includes('pro') || p.id === 2
      }))),
      catchError(() => of([]))
    );
  }

  updateConsultaEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/consultas/${id}`, { estado }).pipe(timeout(this.REQ_TIMEOUT));
  }

  createPlan(plan: Partial<Plan>): Observable<any> {
    return this.http.post(`${this.baseUrl}/planes`, plan).pipe(timeout(this.REQ_TIMEOUT));
  }

  updatePlan(id: number, plan: Partial<Plan>): Observable<any> {
    return this.http.put(`${this.baseUrl}/planes/${id}`, plan).pipe(timeout(this.REQ_TIMEOUT));
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/planes/${id}`).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== USUARIOS (CRUD ADM) - /api/usuarios =====

  getUsers(): Observable<Usuario[]> {
    return this.http.get<{error: boolean, usuarios: Usuario[]}>(`${this.baseUrl}/usuarios`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.usuarios),
      catchError(() => of([]))
    );
  }

  updateUser(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data).pipe(timeout(this.REQ_TIMEOUT));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== TICKETS (CRUD ADM / USUARIO) - /api/tickets =====

  getTicketsAdmin(): Observable<Ticket[]> {
    return this.http.get<{error: boolean, tickets: Ticket[]}>(`${this.baseUrl}/tickets/admin/todos`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.tickets),
      catchError(() => of([]))
    );
  }

  getTicketsCliente(): Observable<Ticket[]> {
    return this.http.get<{error: boolean, tickets: Ticket[]}>(`${this.baseUrl}/tickets/cliente/mis-tickets`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.tickets),
      catchError(() => of([]))
    );
  }

  createTicket(data: { titulo: string, descripcion: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets`, data).pipe(timeout(this.REQ_TIMEOUT));
  }

  updateTicketStatus(id: number, estado: string): Observable<any> {
    // Según rutas: PUT /api/tickets/:id/estado
    return this.http.put(`${this.baseUrl}/tickets/${id}/estado`, { estado }).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== COMENTARIOS (HÍBRIDO) - /api/comentarios =====

  getComentarios(): Observable<Comentario[]> {
    return this.http.get<{error: boolean, comentarios: ComentarioRaw[]}>(`${this.baseUrl}/comentarios`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.comentarios.map((c: ComentarioRaw) => ({
          id: c.id,
          usuario_id: c.usuario_id,
          usuario: c.nombre_usuario || `Usuario ${c.usuario_id}`,
          tipoCliente: c.rol || 'usuario',
          estrellas: c.calificacion,
          texto: c.comentario,
          fecha: c.fecha_comentario,
          estado: c.estado,
          planContratado: c.nombre_plan || 'Plan Hogar'
        } as Comentario))
      ),
      catchError(() => of([]))
    );
  }

  crearComentario(data: { calificacion: number, comentario: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/comentarios`, data).pipe(timeout(this.REQ_TIMEOUT));
  }

  getComentariosPendientes(): Observable<Comentario[]> {
    return this.getComentarios().pipe(
      map(list => list.filter(c => c.estado === 'pendiente'))
    );
  }

  actualizarEstadoComentario(id: number, estado: 'aprobado' | 'rechazado'): Observable<boolean> {
    return this.http.put<{error: boolean}>(`${this.baseUrl}/comentarios/${id}`, { estado }).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => !res.error)
    );
  }

  // ===== DASHBOARDS & MÉTRICAS - /api/dashboard =====

  getMetricasAdmin(): Observable<MetricaServicio> {
    return this.http.get<{error: boolean, metrics: MetricsRaw}>(`${this.baseUrl}/dashboard/admin`).pipe(
      timeout(this.REQ_TIMEOUT),
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
      timeout(this.REQ_TIMEOUT),
      map(res => ({
        perfil: {
          nombre: res.dashboard.servicio?.message ? 'Sin Perfil' : (res.dashboard.servicio.plan ? 'Cliente Activo' : 'Cargando...'),
          email: ''
        },
        servicio: {
          plan: res.dashboard.servicio.plan || 'Sin Plan',
          velocidad: res.dashboard.servicio.velocidad || '0 Mbps',
          precio: Number(res.dashboard.servicio.precio) || 0,
          estado: res.dashboard.servicio.estado || 'inactivo',
          fechaInicio: res.dashboard.servicio.fechaInicio || ''
        },
        facturas: (res.dashboard.facturas || []).map((f: any) => ({
          ...f,
          monto: Number(f.monto)
        })),
        tickets: res.dashboard.tickets || []
      } as DatosCliente))
    );
  }

  // ===== CONSULTAS (ALINEADAS A BD) - /api/consultas =====

  registrarConsulta(datos: { dni: string, nombre: string, email: string, telefono: string, motivo_consulta: string }): Observable<boolean> {
    return this.http.post<{error: boolean}>(`${this.baseUrl}/consultas`, datos).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => !res.error)
    );
  }

  getConsultas(): Observable<any[]> {
    return this.http.get<{error: boolean, consultas: any[]}>(`${this.baseUrl}/consultas`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.consultas),
      catchError(() => of([]))
    );
  }

  // ===== UPLOAD - /api/upload =====

  subirComprobantePago(facturaId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('comprobante', archivo);
    formData.append('facturaId', String(facturaId));
    // Ruta backend: POST /api/upload/comprobante
    return this.http.post(`${this.baseUrl}/upload/comprobante`, formData).pipe(
      timeout(this.REQ_TIMEOUT)
    );
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
  fecha_comentario: string;
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
  servicio: { plan: string, velocidad: string, precio: string | number, estado: string, fechaInicio: string, message?: string };
  facturas: Factura[];
  tickets: Ticket[];
}
