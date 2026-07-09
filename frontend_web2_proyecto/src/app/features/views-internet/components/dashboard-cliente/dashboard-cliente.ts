import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DatosCliente } from '../../models/metrica.model';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-cliente.html',
  styleUrls: ['./dashboard-cliente.css']
})
export class DashboardClienteComponent implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);

  datos?: DatosCliente;
  isLoading = true;

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
      error: () => this.isLoading = false
    });
  }

  simularPago(facturaId: number): void {
    alert(`Redireccionando a pasarela de pago para factura #${facturaId}...`);
  }

  descargarComprobante(facturaId: number): void {
    alert(`Generando PDF para factura #${facturaId}...`);
  }

  cambiarPassword(): void {
    alert('Redireccionando al cambio de contraseña...');
    // Logica real: this.router.navigate(['/cambiar-password']);
  }
}
