import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternetDataService } from '../../services/internet-data.service';
import { DatosCliente } from '../../models/metrica.model';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cliente.html',
  styleUrls: ['./dashboard-cliente.css']
})
export class DashboardClienteComponent implements OnInit {
  datos?: DatosCliente;
  isLoading = true;
  modemActionLoading = false;

  constructor(private dataService: InternetDataService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.dataService.getDatosCliente().subscribe({
      next: (data) => {
        this.datos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos cliente', err);
        this.isLoading = false;
      }
    });
  }

  reiniciarModem(): void {
    this.modemActionLoading = true;
    // Simulación de acción remota
    setTimeout(() => {
      alert('Se ha enviado la señal de reinicio a su módem correctamente.');
      this.modemActionLoading = false;
    }, 2000);
  }

  iniciarTestVelocidad(): void {
    alert('Redireccionando al portal de test de velocidad...');
  }
}
