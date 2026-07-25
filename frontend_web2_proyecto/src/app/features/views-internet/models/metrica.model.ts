/**
 * Interfaz estricta para el modelo de Metricas de Servicio (Admin Dashboard)
 */
export interface MetricaServicio {
  clientesActivos: number;
  serviciosActivos: number;
  ticketsPendientes: number;
  porCobrar: number;
  nodosEstado: NodoRed[];
}

/**
 * Interfaz para el estado de los nodos de red
 */
export interface NodoRed {
  id: string | number;
  nombre: string;
  estado: 'Estable' | 'Saturado';
  ubicacion: string;
  cargaActual: number;
}

/**
 * Interfaz para los datos del cliente en su dashboard (Consolidado de BD)
 */
export interface DatosCliente {
  perfil: {
    nombre: string;
    email: string;
  };
  servicio: {
    plan: string;
    velocidad: string;
    precio: number;
    estado: string;
    fechaInicio: string;
  };
  facturas: Factura[];
  tickets: Ticket[];
}

export interface Factura {
  id: number;
  monto: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  comprobante_pdf?: string | null;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  prioridad?: 'baja' | 'media' | 'alta';
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

/**
 * Interfaz para la tabla 'planes'
 */
export interface Plan {
  id: number;
  nombre_plan: string;
  tipo_plan: string;
  velocidad: string;
  precio: number;
  descripcion?: string;
  estado: string;
  destacado?: boolean;
}
