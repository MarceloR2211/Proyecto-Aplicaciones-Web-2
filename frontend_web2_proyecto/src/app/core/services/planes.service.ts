import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlanResponse, PlanesResponse } from '../models/plan.model';

@Injectable({ providedIn: 'root' })
export class PlanesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  obtenerTodos(): Observable<PlanesResponse> {
    return this.http.get<PlanesResponse>(`${this.baseUrl}/planes`);
  }

  obtenerPorId(id: number): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.baseUrl}/planes/${id}`);
  }
}