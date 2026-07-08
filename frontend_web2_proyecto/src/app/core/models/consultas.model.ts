export interface ConsultasRequest {
  dni: string;
  nombre: string;
  email: string;
  telefono?: string;
  motivo_consulta: string;
}

export interface Consulta extends ConsultasRequest {
  id: number;
  estado: 'pendiente' | 'revisado' | 'convertido';
  fecha_creacion: string;
}

export interface ConsultasResponse {
  error: boolean;
  message: string;
  consulta: Consulta;
}