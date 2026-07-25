import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  NgForm
} from '@angular/forms';

import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DatosCliente } from '../../models/metrica.model';

import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './dashboard-cliente.html',
  styleUrls: ['./dashboard-cliente.css']
})
export class DashboardClienteComponent implements OnInit {
  private readonly dataService = inject(InternetDataService);
  public readonly authService = inject(AuthService);

  nuevoTicket: {
    titulo: string;
    descripcion: string;
    prioridad: 'baja' | 'media' | 'alta';
  } = {
    titulo: '',
    descripcion: '',
    prioridad: 'media'
  };

  passUpdate = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  datos: DatosCliente | null = null;

  isLoading = signal(true);
  isSubmitting = signal(false);

  feedbackTitle = '';
  feedbackMessage = '';
  isSuccess = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  get nombreUsuario(): string {
    const usuarioSesion =
      this.authService.usuarioActual();

    const nombreSesion =
      usuarioSesion?.nombre_completo?.trim();

    const nombrePerfil =
      this.datos?.perfil?.nombre?.trim();

    if (
      nombreSesion &&
      nombreSesion.toLowerCase() !== 'cliente'
    ) {
      return nombreSesion;
    }

    if (
      nombrePerfil &&
      nombrePerfil.toLowerCase() !== 'cliente'
    ) {
      return nombrePerfil;
    }

    return usuarioSesion?.username || 'Cliente';
  }

  get passwordNoCoincide(): boolean {
    return Boolean(
      this.passUpdate.confirmar &&
      this.passUpdate.nueva !==
        this.passUpdate.confirmar
    );
  }

  cargarDatos(): void {
    this.isLoading.set(true);

    this.dataService
      .getDatosCliente()
      .subscribe({
        next: (data: DatosCliente) => {
          this.datos = data;
          this.isLoading.set(false);
        },

        error: (err: any) => {
          this.isLoading.set(false);

          this.mostrarFeedback(
            'Error',
            err.error?.message ||
              'No se pudo cargar el perfil.',
            false
          );
        }
      });
  }

  crearTicket(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    const ticket = {
      titulo:
        this.nuevoTicket.titulo.trim(),

      descripcion:
        this.nuevoTicket.descripcion.trim(),

      prioridad:
        this.nuevoTicket.prioridad
    };

    this.isSubmitting.set(true);

    this.dataService
      .createTicket(ticket)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);

          this.cerrarModal('ticketModal');

          this.nuevoTicket = {
            titulo: '',
            descripcion: '',
            prioridad: 'media'
          };

          form.resetForm(this.nuevoTicket);
          this.cargarDatos();

          setTimeout(() => {
            this.mostrarFeedback(
              'Éxito',
              'Ticket generado correctamente.',
              true
            );
          }, 150);
        },

        error: (err: any) => {
          this.isSubmitting.set(false);

          this.mostrarFeedback(
            'Error',
            err.error?.message ||
              'Error al crear el ticket.',
            false
          );
        }
      });
  }

  confirmarCambioPassword(
    form: NgForm
  ): void {
    if (form.invalid || this.passwordNoCoincide) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .changePassword({
        username:
          this.authService
            .usuarioActual()
            ?.username || '',

        newPassword:
          this.passUpdate.nueva,

        confirmPassword:
          this.passUpdate.confirmar
      })
      .subscribe({
        next: (res: any) => {
          this.isSubmitting.set(false);

          if (res?.error) {
            this.mostrarFeedback(
              'Error',
              res.message ||
                'No se pudo actualizar la contraseña.',
              false
            );

            return;
          }

          this.cerrarModal('passwordModal');

          this.passUpdate = {
            actual: '',
            nueva: '',
            confirmar: ''
          };

          form.resetForm(this.passUpdate);

          setTimeout(() => {
            this.mostrarFeedback(
              'Éxito',
              'Contraseña actualizada correctamente.',
              true
            );
          }, 150);
        },

        error: (err: any) => {
          this.isSubmitting.set(false);

          this.mostrarFeedback(
            'Error',
            err.error?.message ||
              'Error al actualizar la contraseña.',
            false
          );
        }
      });
  }

  onFileSelected(
    event: Event,
    facturaId: number
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      this.mostrarFeedback(
        'Archivo inválido',
        'Selecciona un archivo PDF.',
        false
      );

      input.value = '';
      return;
    }

    const limite = 5 * 1024 * 1024;

    if (file.size > limite) {
      this.mostrarFeedback(
        'Archivo demasiado grande',
        'El comprobante no puede superar los 5 MB.',
        false
      );

      input.value = '';
      return;
    }

    this.isSubmitting.set(true);

    this.dataService
      .subirComprobantePago(
        facturaId,
        file
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          input.value = '';

          this.mostrarFeedback(
            'Archivo recibido',
            'Comprobante subido con éxito.',
            true
          );

          this.cargarDatos();
        },

        error: (err: any) => {
          this.isSubmitting.set(false);

          this.mostrarFeedback(
            'Error',
            err.error?.message ||
              'Error al subir el archivo.',
            false
          );
        }
      });
  }

  descargarComprobante(id: number): void {
    this.mostrarFeedback(
      'Descarga',
      `Iniciando la descarga del comprobante de la factura #${id}.`,
      true
    );
  }

  abrirNuevoTicket(): void {
    this.nuevoTicket = {
      titulo: '',
      descripcion: '',
      prioridad: 'media'
    };

    this.abrirModal('ticketModal');
  }

  mostrarFeedback(
    title: string,
    msg: string,
    success: boolean
  ): void {
    this.feedbackTitle = title;
    this.feedbackMessage = msg;
    this.isSuccess = success;

    this.abrirModal('feedbackModal');
  }

  private abrirModal(id: string): void {
    const elemento =
      document.getElementById(id);

    if (
      elemento &&
      (window as any).bootstrap
    ) {
      const modal =
        (window as any).bootstrap.Modal
          .getOrCreateInstance(elemento);

      modal.show();
    }
  }

  private cerrarModal(id: string): void {
    const elemento =
      document.getElementById(id);

    if (
      elemento &&
      (window as any).bootstrap
    ) {
      const modal =
        (window as any).bootstrap.Modal
          .getInstance(elemento);

      modal?.hide();
    }
  }
}