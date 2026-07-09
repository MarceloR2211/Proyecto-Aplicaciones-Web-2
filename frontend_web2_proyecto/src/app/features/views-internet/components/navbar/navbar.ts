import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  irMiCuenta(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario?.rol === 'admin') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/dashboard-cliente']);
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/internet-index']);
    });
  }
}
