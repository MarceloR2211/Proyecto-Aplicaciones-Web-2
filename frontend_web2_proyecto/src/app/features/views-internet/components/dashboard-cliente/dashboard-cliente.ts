import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DatosCliente, Ticket } from '../../models/metrica.model';
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

  datos: DatosCliente | null = null;
  isLoading = signal(true);
  isSubmitting = signal(false);

  // Feedback UI
  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading.set(true);
    this.dataService.getDatosCliente().subscribe({
      next: (data: DatosCliente) => {
        this.datos = data;
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.mostrarFeedback('Error', err.error?.message || 'No se pudo cargar el perfil.', false);
        this.isLoading.set(false);
      }
    });
  }

  crearTicket(): void {
    if (!this.nuevoTicket.titulo || !this.nuevoTicket.descripcion) return;

    this.isSubmitting.set(true);
    this.dataService.createTicket(this.nuevoTicket).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.mostrarFeedback('Éxito', 'Ticket generado correctamente.', true);
        this.nuevoTicket = { titulo: '', descripcion: '' };
        this.cargarDatos();
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.mostrarFeedback('Error', err.error?.message || 'Error al crear ticket.', false);
      }
    });
  }

  confirmarCambioPassword(): void {
    if (this.passUpdate.nueva !== this.passUpdate.confirmar) {
      this.mostrarFeedback('Validación', 'Las contraseñas no coinciden.', false);
      return;
    }

    this.isSubmitting.set(true);
    this.authService.changePassword({
      username: this.authService.usuarioActual()?.username || '',
      newPassword: this.passUpdate.nueva,
      confirmPassword: this.passUpdate.confirmar
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        if (!res.error) {
          this.mostrarFeedback('Éxito', 'Contraseña actualizada correctamente.', true);
        }
        this.passUpdate = { actual: '', nueva: '', confirmar: '' };
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.mostrarFeedback('Error', err.error?.message || 'Error al actualizar contraseña.', false);
      }
    });
  }

  onFileSelected(event: any, facturaId: number): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.isSubmitting.set(true);
      this.dataService.subirComprobantePago(facturaId, file).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.mostrarFeedback('Archivo Recibido', 'Comprobante subido con éxito.', true);
          this.cargarDatos();
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          this.mostrarFeedback('Error', err.error?.message || 'Error al subir archivo.', false);
        }
      });
    } else {
      this.mostrarFeedback('Archivo Inválido', 'Por favor seleccione un archivo PDF.', false);
    }
  }

  actualizarPerfil(datos: DatosCliente): void {
    const usuario = this.authService.usuarioActual();
    if (usuario && datos.perfil.nombre) {
      this.isSubmitting.set(true);
      this.dataService.updateUser(usuario.id, {
        nombre_completo: datos.perfil.nombre
      }).subscribe({
        next: () => {
           this.isSubmitting.set(false);
           this.mostrarFeedback('Éxito', 'Perfil actualizado correctamente.', true);
           this.cargarDatos();
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          this.mostrarFeedback('Error', err.error?.message || 'Error al actualizar perfil.', false);
        }
      });
    }
  }

  mostrarFeedback(title: string, msg: string, success: boolean): void {
    this.feedbackTitle = title;
    this.feedbackMessage = msg;
    this.isSuccess = success;
    const el = document.getElementById('feedbackModal');
    if (el && (window as any).bootstrap) {
      const m = new (window as any).bootstrap.Modal(el);
      m.show();
    }
  }
}
