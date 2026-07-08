/**
 * Interfaz estricta para el modelo de Metricas de Servicio
 */
export interface MetricaServicio {
  clientesActivos: number;
  ticketsPendientes: number;
  anchoBandaConsumidoGbps: number;
  nodosEstado: NodoRed[];
}

/**
 * Interfaz para el estado de los nodos de red
 */
export interface NodoRed {
  id: string;
  nombre: string;
  estado: 'Estable' | 'Saturado';
  ubicacion: string;
  cargaActual: number; // Porcentaje 0-100
}

/**
 * Interfaz para los datos del cliente en su dashboard
 */
export interface DatosCliente {
  nombre: string;
  planNombre: string;
  velocidadMegas: number;
  estadoModem: 'Online' | 'Offline';
  fechaVencimiento: string;
  montoPagar: number;
}
