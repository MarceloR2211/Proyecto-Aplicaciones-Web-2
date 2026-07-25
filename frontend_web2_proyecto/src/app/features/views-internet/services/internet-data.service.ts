import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, map, of, switchMap, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente, Plan, Ticket } from '../models/metrica.model';
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
      timeout(this.REQ_TIMEOUT),
      map(res => res.planes.map(p => ({
        ...p,
        precio: Number(p.precio),
        estado: p.estado || 'activo'
      }))),
      catchError(() => of([]))
    );
  }

  createPlan(plan: Partial<Plan>): Observable<any> {
    return this.http.post(`${this.baseUrl}/planes`, {
      ...plan,
      estado: plan.estado || 'activo'
    }).pipe(timeout(this.REQ_TIMEOUT));
  }

  updatePlan(id: number, plan: Partial<Plan>): Observable<any> {
    return this.http.put(`${this.baseUrl}/planes/${id}`, plan).pipe(timeout(this.REQ_TIMEOUT));
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/planes/${id}`).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== USUARIOS =====
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

  // ===== CONSULTAS (LEADS) =====
  getConsultas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consultas`).pipe(
      timeout(this.REQ_TIMEOUT),
      catchError(() => of([]))
    );
  }

  registrarConsulta(datos: { dni: string, nombre: string, email: string, telefono: string, motivo_consulta: string }): Observable<boolean> {
    return this.http.post<{error: boolean}>(`${this.baseUrl}/consultas`, datos).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => !res.error)
    );
  }

  updateConsultaEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/consultas/${id}`, { estado }).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== COMENTARIOS =====
  getComentarios(): Observable<Comentario[]> {
    return this.http.get<{error: boolean, comentarios: any[]}>(`${this.baseUrl}/comentarios`).pipe(
      timeout(this.REQ_TIMEOUT),
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
    return this.http.post(`${this.baseUrl}/comentarios`, data).pipe(timeout(this.REQ_TIMEOUT));
  }

  getComentariosPendientes(): Observable<Comentario[]> {
    return this.getComentarios().pipe(
      map(list => list.filter(c => c.estado === 'pendiente'))
    );
  }

  actualizarEstadoComentario(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/comentarios/${id}`, { estado }).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== TICKETS =====
  getTicketsAdmin(): Observable<Ticket[]> {
    return this.http.get<{error: boolean, tickets: Ticket[]}>(`${this.baseUrl}/tickets/admin/todos`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => res.tickets),
      catchError(() => of([]))
    );
  }

  createTicket(data: {
    titulo: string;
    descripcion: string;
    prioridad: 'baja' | 'media' | 'alta';
  }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/tickets`, data)
      .pipe(timeout(this.REQ_TIMEOUT));
  }

  updateTicketStatus(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/tickets/${id}/estado`, { estado }).pipe(timeout(this.REQ_TIMEOUT));
  }

  // ===== DASHBOARDS & MÉTRICAS =====
  getMetricasAdmin(): Observable<MetricaServicio> {
    return this.http.get<{error: boolean, metrics: any}>(`${this.baseUrl}/dashboard/admin`).pipe(
      timeout(this.REQ_TIMEOUT),
      map(res => ({
        clientesActivos: res.metrics.totalClientes,
        serviciosActivos: res.metrics.serviciosActivos,
        ticketsPendientes: res.metrics.ticketsPendientes,
        porCobrar: Number(res.metrics.porCobrar) || 0,
        nodosEstado: [
          { id: 1, nombre: 'Nodo Central', estado: 'Estable', ubicacion: 'Cercado', cargaActual: 45 },
          { id: 2, nombre: 'Nodo Periferia', estado: 'Saturado', ubicacion: 'Pampa Inalámbrica', cargaActual: 88 }
        ]
      } as MetricaServicio)),
      catchError(() => of({
        clientesActivos: 0, serviciosActivos: 0, ticketsPendientes: 0, porCobrar: 0, nodosEstado: []
      } as MetricaServicio))
    );
  }

  getDatosCliente(): Observable<DatosCliente> {
    return this.http
      .get<{ error: boolean; dashboard: any }>(
        `${this.baseUrl}/dashboard/cliente`
      )
      .pipe(
        timeout(this.REQ_TIMEOUT),
        map((res) => {
          const dashboard = res.dashboard || {};

          return {
            perfil: {
              nombre: dashboard.perfil?.nombre_completo || 'Cliente',
              email: dashboard.perfil?.email || ''
            },
            servicio: {
              plan: dashboard.servicio?.plan || 'Sin plan contratado',
              velocidad: dashboard.servicio?.velocidad || '0 Mbps',
              precio: Number(dashboard.servicio?.precio) || 0,
              estado: dashboard.servicio?.estado || 'sin_contrato',
              fechaInicio: dashboard.servicio?.fechaInicio || ''
            },
            facturas: (dashboard.facturas || []).map((factura: any) => ({
              ...factura,
              monto: Number(factura.monto)
            })),
            tickets: dashboard.tickets || []
          } as DatosCliente;
        })
      );
  }

  // ===== UPLOAD =====
  subirComprobantePago(
    facturaId: number,
    archivo: File
  ): Observable<any> {
    return from(this.leerArchivoComoDataUrl(archivo)).pipe(
      switchMap((contenidoBase64) =>
        this.http.post(`${this.baseUrl}/upload/comprobante`, {
          facturaId,
          nombreArchivo: archivo.name,
          contenidoBase64
        })
      ),
      timeout(this.REQ_TIMEOUT)
    );
  }

  private leerArchivoComoDataUrl(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(String(lector.result || ''));
      lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      lector.readAsDataURL(archivo);
    });
  }
}
