import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DatosCliente } from '../../models/metrica.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard-cliente.html',
  styleUrls: ['./dashboard-cliente.css']
})
export class DashboardClienteComponent implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);

  datos: DatosCliente = {
    perfil: { nombre: 'Cargando...', email: '...' },
    servicio: { plan: '...', velocidad: '...', precio: 0, estado: '...', fechaInicio: '' },
    facturas: [],
    tickets: []
  };
  isLoading = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario) {
      this.datos.perfil = { nombre: usuario.nombre_completo, email: `${usuario.username}@internetpro.com` };
    }

    this.isLoading = true;
    this.dataService.getDatosCliente().subscribe({
      next: (data) => {
        this.datos = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Fallback mock si el backend no responde
        if (!this.datos.servicio.plan || this.datos.servicio.plan === '...') {
          this.datos.servicio = { plan: 'Hogar Fibra 300', velocidad: '300 Mbps', precio: 45.99, estado: 'activo', fechaInicio: '2023-01-15' };
          this.datos.facturas = [
            { id: 101, monto: 45.99, fecha_emision: '2023-10-01', fecha_vencimiento: '2023-10-15', estado: 'pagado' },
            { id: 102, monto: 45.99, fecha_emision: '2023-11-01', fecha_vencimiento: '2023-11-15', estado: 'pendiente' }
          ];
        }
      }
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
