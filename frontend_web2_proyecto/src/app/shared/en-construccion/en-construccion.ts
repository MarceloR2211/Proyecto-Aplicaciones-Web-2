import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-en-construccion',
  standalone: true,
  imports: [],
  templateUrl: './en-construccion.html',
  styleUrl: './en-construccion.scss'
})
export class EnConstruccion {
  @Input() titulo = 'Esta sección';
}