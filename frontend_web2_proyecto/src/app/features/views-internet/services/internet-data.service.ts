import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Comentario } from '../models/comentario.model';
import { MetricaServicio, DatosCliente } from '../models/metrica.model';

/**
 * Servicio Angular para la gestión de datos de Internet
 * Simula la comunicación con un backend de Express.
 */
@Injectable({
  providedIn: 'root'
})
export class InternetDataService {

  // Mock de datos iniciales para comentarios
  private comentariosMock: Comentario[] = [
    {
      id: 1,
      usuario: 'Juan Pérez',
      tipoCliente: 'residencial',
      estrellas: 5,
      texto: 'Excelente servicio, muy estable.',
      fecha: '2023-10-01',
      estado: 'pendiente',
      planContratado: 'Hogar 300 Megas'
    },
    {
      id: 2,
      usuario: 'Tech Solutions S.A.',
      tipoCliente: 'corporativo',
      estrellas: 4,
      texto: 'Buen soporte técnico, aunque el tiempo de respuesta puede mejorar.',
      fecha: '2023-10-02',
      estado: 'pendiente',
      planContratado: 'Fibra Simétrica 1Gbps'
    },
    {
      id: 3,
      usuario: 'María García',
      tipoCliente: 'residencial',
      estrellas: 2,
      texto: 'Se cae mucho el internet por las tardes.',
      fecha: '2023-10-03',
      estado: 'pendiente',
      planContratado: 'Hogar 100 Megas'
    }
  ];

  constructor() {}

  /**
   * Obtiene la lista de comentarios pendientes de aprobación
   */
  getComentariosPendientes(): Observable<Comentario[]> {
    const pendientes = this.comentariosMock.filter(c => c.estado === 'pendiente');
    return of(pendientes).pipe(delay(800)); // Simula latencia de red
  }

  /**
   * Aprueba un comentario por ID
   */
  aprobarComentario(id: number): Observable<boolean> {
    const index = this.comentariosMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.comentariosMock[index].estado = 'aprobado';
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  /**
   * Rechaza un comentario por ID
   */
  rechazarComentario(id: number): Observable<boolean> {
    const index = this.comentariosMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.comentariosMock[index].estado = 'rechazado';
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  /**
   * Obtiene métricas para el Dashboard de Administrador
   */
  getMetricasAdmin(): Observable<MetricaServicio> {
    const metricas: MetricaServicio = {
      clientesActivos: 1250,
      ticketsPendientes: 14,
      anchoBandaConsumidoGbps: 45.8,
      nodosEstado: [
        { id: 'N-01', nombre: 'Nodo Norte - Central', estado: 'Estable', ubicacion: 'Av. Libertador', cargaActual: 45 },
        { id: 'N-02', nombre: 'Nodo Sur - Residencial', estado: 'Saturado', ubicacion: 'Calle 50', cargaActual: 92 },
        { id: 'N-03', nombre: 'Nodo Este - Industrial', estado: 'Estable', ubicacion: 'Zona Industrial', cargaActual: 60 },
        { id: 'N-04', nombre: 'Nodo Oeste', estado: 'Estable', ubicacion: 'Barrio Nuevo', cargaActual: 30 }
      ]
    };
    return of(metricas).pipe(delay(1000));
  }

  /**
   * Obtiene datos del cliente para su dashboard personal
   */
  getDatosCliente(): Observable<DatosCliente> {
    const datos: DatosCliente = {
      nombre: 'Carlos Rodríguez',
      planNombre: 'Hogar Ultra',
      velocidadMegas: 300,
      estadoModem: 'Online',
      fechaVencimiento: '2023-11-15',
      montoPagar: 45.99
    };
    return of(datos).pipe(delay(700));
  }
}
