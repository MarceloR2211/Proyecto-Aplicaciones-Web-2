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

  nuevoTicket = { titulo: '', descripcion: '' };
  passUpdate = { actual: '', nueva: '', confirmar: '' };

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

  crearTicket(): void {
    if (!this.nuevoTicket.titulo || !this.nuevoTicket.descripcion) return;
    this.dataService.createTicket(this.nuevoTicket).subscribe({
      next: () => {
        alert('Ticket generado correctamente.');
        this.nuevoTicket = { titulo: '', descripcion: '' };
        this.cargarDatos();
      }
    });
  }

  confirmarCambioPassword(): void {
    if (this.passUpdate.nueva !== this.passUpdate.confirmar) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    this.authService.changePassword({
      username: this.authService.usuarioActual()?.username || '',
      newPassword: this.passUpdate.nueva,
      confirmPassword: this.passUpdate.confirmar
    }).subscribe({
      next: (res) => {
        if (!res.error) alert('Contraseña actualizada.');
        this.passUpdate = { actual: '', nueva: '', confirmar: '' };
      }
    });
  }

  onFileSelected(event: any, facturaId: number): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.dataService.subirComprobantePago(facturaId, file).subscribe({
        next: () => {
          alert('Comprobante subido con éxito. El administrador revisará su pago.');
          this.cargarDatos();
        },
        error: () => alert('Error al subir el archivo. Intente nuevamente.')
      });
    } else {
      alert('Por favor seleccione un archivo PDF válido.');
    }
  }

  cambiarPassword(): void {
    const nueva = prompt('Ingrese su nueva contraseña:');
    if (nueva && nueva.length >= 6) {
      this.authService.changePassword({
        username: this.authService.usuarioActual()?.username || '',
        newPassword: nueva,
        confirmPassword: nueva
      }).subscribe({
        next: (res) => {
          if (!res.error) alert('Contraseña actualizada con éxito.');
          else alert(res.message);
        }
      });
    } else {
      alert('La contraseña debe tener al menos 6 caracteres.');
    }
  }

  actualizarPerfil(): void {
    if (this.datos.perfil.nombre) {
      const usuario = this.authService.usuarioActual();
      if (usuario) {
        this.dataService.updateUser(usuario.id, { nombre_completo: this.datos.perfil.nombre }).subscribe({
          next: () => alert('Perfil actualizado en la base de datos.'),
          error: () => alert('Error al actualizar perfil.')
        });
      }
    }
  }

  cambiarFoto(): void {
    alert('Función de carga de imagen de perfil activada. Seleccione su archivo (Simulado).');
  }
}
