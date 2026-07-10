import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
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

  datos$: Observable<DatosCliente> | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.datos$ = this.dataService.getDatosCliente();
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

  actualizarPerfil(datos: DatosCliente): void {
    if (datos.perfil.nombre) {
      const usuario = this.authService.usuarioActual();
      if (usuario) {
        this.dataService.updateUser(usuario.id, {
          nombre_completo: datos.perfil.nombre
        }).subscribe({
          next: () => {
             alert('Perfil actualizado con éxito en PostgreSQL.');
             this.cargarDatos();
          },
          error: () => alert('Error al actualizar perfil.')
        });
      }
    }
  }

  cambiarFoto(): void {
    alert('Función de carga de imagen de perfil activada. Seleccione su archivo (Simulado).');
  }
}
