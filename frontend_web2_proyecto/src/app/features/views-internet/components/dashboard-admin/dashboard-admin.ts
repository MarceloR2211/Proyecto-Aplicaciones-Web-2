import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { MetricaServicio } from '../../models/metrica.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit {
  private dataService = inject(InternetDataService);

  metricas?: MetricaServicio;
  isLoading = true;

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
      error: () => this.isLoading = false
    });
  }
}
