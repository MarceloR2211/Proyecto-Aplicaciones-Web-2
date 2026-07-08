import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-main.html',
  styleUrls: ['./index-main.css']
})
export class IndexMainComponent {
  // Lista de planes para renderizar en el grid
  planes = [
    {
      nombre: 'Hogar Básico',
      velocidad: '100 Megas',
      descripcion: 'Ideal para navegación y redes sociales.',
      precio: '29.99',
      destacado: false,
      caracteristicas: ['Fibra Óptica', 'Wifi 6', 'Soporte 24/7']
    },
    {
      nombre: 'Hogar Pro',
      velocidad: '300 Megas',
      descripcion: 'Perfecto para streaming 4K y gaming.',
      precio: '45.99',
      destacado: true, // Este es el plan más vendido
      caracteristicas: ['Fibra Óptica', 'Wifi 6 de alta gama', 'Soporte prioritario']
    },
    {
      nombre: 'Corporativo Pyme',
      velocidad: '500 Megas Simétricos',
      descripcion: 'Para empresas que requieren máxima estabilidad.',
      precio: '89.99',
      destacado: false,
      caracteristicas: ['IP Fija opcional', 'SLA 99.9%', 'Canal dedicado']
    }
  ];
}
