import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternetDataService } from '../../services/internet-data.service';
import { MetricaServicio } from '../../models/metrica.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit {
  metricas?: MetricaServicio;
  isLoading = true;

  constructor(private dataService: InternetDataService) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.isLoading = true;
    this.dataService.getMetricasAdmin().subscribe({
      next: (data) => {
        this.metricas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar métricas', err);
        this.isLoading = false;
      }
    });
  }
}
