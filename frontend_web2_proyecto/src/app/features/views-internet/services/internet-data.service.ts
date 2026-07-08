import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente } from '../models/metrica.model';

/**
 * Servicio Angular para la gestión de datos de Internet
 * Conectado al backend real.
 */
@Injectable({
  providedIn: 'root'
})
export class InternetDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  constructor() {}

  /**
   * Obtiene la lista de comentarios pendientes de aprobación
   */
  getComentariosPendientes(): Observable<Comentario[]> {
    return this.http.get<{error: boolean, comentarios: any[]}>(`${this.baseUrl}/comentarios`).pipe(
      map(res => res.comentarios),
      map(comentarios => comentarios
        .filter(c => c.estado === 'pendiente')
        .map(c => ({
          id: c.id,
          usuario: c.nombre_usuario || `Usuario ${c.usuario_id}`,
          tipoCliente: c.tipo_usuario || 'residencial',
          estrellas: c.calificacion,
          texto: c.comentario,
          fecha: c.fecha_creacion,
          estado: c.estado,
          planContratado: c.plan_nombre || 'Plan Estándar'
        } as Comentario))
      )
    );
  }

  /**
   * Aprueba un comentario por ID
   */
  aprobarComentario(id: number): Observable<boolean> {
    return this.http.put<{error: boolean}>(`${this.baseUrl}/comentarios/${id}`, { estado: 'aprobado' }).pipe(
      map(res => !res.error)
    );
  }

  /**
   * Rechaza un comentario por ID
   */
  rechazarComentario(id: number): Observable<boolean> {
    // El backend permite actualizar el estado a 'rechazado' o eliminarlo
    return this.http.put<{error: boolean}>(`${this.baseUrl}/comentarios/${id}`, { estado: 'rechazado' }).pipe(
      map(res => !res.error)
    );
  }

  /**
   * Obtiene métricas para el Dashboard de Administrador
   */
  getMetricasAdmin(): Observable<MetricaServicio> {
    return this.http.get<{error: boolean, metrics: any}>(`${this.baseUrl}/dashboard/admin`).pipe(
      map(res => ({
        clientesActivos: res.metrics.total_clientes || 0,
        ticketsPendientes: res.metrics.tickets_abiertos || 0,
        anchoBandaConsumidoGbps: res.metrics.consumo_red || 0,
        nodosEstado: (res.metrics.nodos || []).map((n: any) => ({
          id: n.codigo || n.id,
          nombre: n.nombre,
          estado: n.estado === 'activo' ? 'Estable' : 'Saturado',
          ubicacion: n.zona,
          cargaActual: n.carga || 0
        }))
      } as MetricaServicio))
    );
  }

  /**
   * Obtiene datos del cliente para su dashboard personal
   */
  getDatosCliente(): Observable<DatosCliente> {
    return this.http.get<{error: boolean, dashboard: any}>(`${this.baseUrl}/dashboard/cliente`).pipe(
      map(res => ({
        nombre: res.dashboard.usuario.nombre,
        planNombre: res.dashboard.servicio.plan,
        velocidadMegas: res.dashboard.servicio.velocidad,
        estadoModem: res.dashboard.servicio.estado_modem === 'online' ? 'Online' : 'Offline',
        fechaVencimiento: res.dashboard.facturacion.proximo_vencimiento,
        montoPagar: res.dashboard.facturacion.monto_pendiente
      } as DatosCliente))
    );
  }
}
