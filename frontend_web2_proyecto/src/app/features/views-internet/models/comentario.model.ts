/**
 * Interfaz estricta para el modelo de Comentario
 */
export interface Comentario {
  id: number;
  usuario: string;
  tipoCliente: 'residencial' | 'corporativo';
  estrellas: number; // 1 a 5
  texto: string;
  fecha: string; // ISO format
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  planContratado?: string; // Campo opcional para mostrar en la gestión
}
