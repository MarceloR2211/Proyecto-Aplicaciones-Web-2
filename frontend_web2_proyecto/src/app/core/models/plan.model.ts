export interface Plan {
  id: number;
  nombre_plan: string;
  tipo_plan: string;
  velocidad: string;
  precio: number;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}

export interface PlanesResponse {
  error: boolean;
  planes: Plan[];
}

export interface PlanResponse {
  error: boolean;
  plan: Plan;
}