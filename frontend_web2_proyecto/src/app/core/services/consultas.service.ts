import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConsultasRequest, ConsultasResponse } from '../models/consultas.model';

@Injectable({ providedIn: 'root' })
export class ConsultasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  enviarConsulta(datos: ConsultasRequest): Observable<ConsultasResponse> {
    return this.http.post<ConsultasResponse>(`${this.baseUrl}/consultas`, datos);
  }
}