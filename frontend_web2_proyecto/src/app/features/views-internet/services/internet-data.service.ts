import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente, Plan, Ticket, Factura } from '../models/metrica.model';
import { Usuario } from '../../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class InternetDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly REQ_TIMEOUT = 5000;

  // ===== PLANES =====
  getPlanes(): Observable<Plan[]> {
    return this.http.get<{error: boolean, planes: Plan[]}>(`${this.baseUrl}/planes`).pipe(
      map(res => res.planes.map(p => ({...p, precio: Number(p.precio)}))),
      catchError(() => of([]))
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

  // ===== USUARIOS =====
  getUsers(): Observable<Usuario[]> {
    return this.http.get<{error: boolean, usuarios: Usuario[]}>(`${this.baseUrl}/usuarios`).pipe(
      map(res => res.usuarios),
      catchError(() => of([]))
    );
  }

  updateUser(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data);
  }

  // ===== CONSULTAS (LEADS) =====
  getConsultas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consultas`).pipe(
      catchError(() => of([]))
    );
  }

  registrarConsulta(datos: any): Observable<boolean> {
    return this.http.post<{error: boolean}>(`${this.baseUrl}/consultas`, datos).pipe(
      map(res => !res.error)
    );
  }

  updateConsultaEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/consultas/${id}`, { estado });
  }

  // ===== COMENTARIOS =====
  getComentarios(): Observable<Comentario[]> {
    return this.http.get<{error: boolean, comentarios: any[]}>(`${this.baseUrl}/comentarios`).pipe(
      map(res => res.comentarios.map(c => ({
        id: c.id,
        usuario: c.nombre_usuario || 'Anónimo',
        texto: c.comentario,
        estado: c.estado,
        planContratado: c.nombre_plan || 'Plan Hogar',
        estrellas: c.calificacion || 5,
        fecha: c.fecha_comentario || ''
      } as Comentario))),
      catchError(() => of([]))
    );
  }

  crearComentario(data: { calificacion: number, comentario: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/comentarios`, data);
  }

  getComentariosPendientes(): Observable<Comentario[]> {
    return this.getComentarios().pipe(
      map(list => list.filter(c => c.estado === 'pendiente'))
    );
  }

  actualizarEstadoComentario(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/comentarios/${id}`, { estado });
  }

  // ===== TICKETS =====
  getTicketsAdmin(): Observable<Ticket[]> {
    return this.http.get<{error: boolean, tickets: Ticket[]}>(`${this.baseUrl}/tickets/admin/todos`).pipe(
      map(res => res.tickets),
      catchError(() => of([]))
    );
  }

  createTicket(data: { titulo: string, descripcion: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets`, data);
  }

  // ===== DASHBOARDS & MÉTRICAS =====
  getMetricasAdmin(): Observable<MetricaServicio> {
    return this.http.get<{error: boolean, metrics: any}>(`${this.baseUrl}/dashboard/admin`).pipe(
      map(res => ({
        clientesActivos: res.metrics.totalClientes,
        serviciosActivos: res.metrics.serviciosActivos,
        ticketsPendientes: res.metrics.ticketsPendientes,
        porCobrar: Number(res.metrics.porCobrar) || 0,
        nodosEstado: []
      } as MetricaServicio)),
      catchError(() => of({
        clientesActivos: 0, serviciosActivos: 0, ticketsPendientes: 0, porCobrar: 0, nodosEstado: []
      } as MetricaServicio))
    );
  }

  getDatosCliente(): Observable<DatosCliente> {
    return this.http.get<{error: boolean, dashboard: any}>(`${this.baseUrl}/dashboard/cliente`).pipe(
      map(res => ({
        perfil: {
          nombre: res.dashboard.servicio?.plan ? 'Cliente Activo' : 'Sin Perfil',
          email: ''
        },
        servicio: {
          plan: res.dashboard.servicio?.plan || 'Sin Plan',
          velocidad: res.dashboard.servicio?.velocidad || '0 Mbps',
          precio: Number(res.dashboard.servicio?.precio) || 0,
          estado: res.dashboard.servicio?.estado || 'inactivo',
          fechaInicio: res.dashboard.servicio?.fechaInicio || ''
        },
        facturas: (res.dashboard.facturas || []).map((f: any) => ({
          ...f,
          monto: Number(f.monto)
        })),
        tickets: res.dashboard.tickets || []
      } as DatosCliente)),
      timeout(this.REQ_TIMEOUT)
    );
  }

  // ===== UPLOAD =====
  subirComprobantePago(facturaId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('comprobante', archivo);
    formData.append('facturaId', String(facturaId));
    return this.http.post(`${this.baseUrl}/upload/comprobante`, formData);
  }
}
