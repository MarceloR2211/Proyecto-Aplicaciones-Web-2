import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternetDataService } from '../../services/internet-data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Plan } from '../../models/metrica.model';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-index-main',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './index-main.html',
  styleUrls: ['./index-main.css']
})
export class IndexMainComponent implements OnInit {
  private dataService = inject(InternetDataService);
  public authService = inject(AuthService);
  private router = inject(Router);

  planes: Plan[] = [];
  isLoading = true;

  // Formulario de consulta
  consulta = {
    dni: '',
    nombre: '',
    email: '',
    telefono: '',
    motivo_consulta: ''
  };

  ngOnInit(): void {
    // Forzamos carga inmediata para evitar bugs de detección de cambios
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.isLoading = true;
    this.dataService.getPlanes().subscribe({
      next: (data) => {
        this.planes = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  enviarConsulta(): void {
    if (!this.consulta.dni || !this.consulta.nombre || !this.consulta.email) {
      alert('Por favor complete los campos obligatorios (DNI, Nombre, Email).');
      return;
    }

    this.dataService.registrarConsulta(this.consulta).subscribe({
      next: (success) => {
        if (success) {
          alert('Su consulta ha sido enviada con éxito. Un asesor lo contactará pronto.');
          this.consulta = { dni: '', nombre: '', email: '', telefono: '', motivo_consulta: '' };
        }
      }
    });
  }

  irMiCuenta(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario?.rol === 'admin') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/dashboard-cliente']);
    }
  }
}
