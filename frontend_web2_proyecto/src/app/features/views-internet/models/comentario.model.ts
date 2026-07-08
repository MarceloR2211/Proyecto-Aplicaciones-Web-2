/**
 * Interfaz estricta para el modelo de Comentario (Tabla comentarios_publicos)
 */
export interface Comentario {
  id: number;
  usuario_id: number;
  usuario: string; // nombre completo del JOIN
  tipoCliente: string; // rol del usuario
  estrellas: number; // calificacion en BD
  texto: string; // comentario en BD
  fecha: string; // fecha_creacion en BD
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  planContratado?: string; // nombre_plan del JOIN
}
