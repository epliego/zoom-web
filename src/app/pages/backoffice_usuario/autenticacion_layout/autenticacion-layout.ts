import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../../partials/footer/footer';

@Component({
  selector: 'autenticacion-layout-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './autenticacion-layout.html',
  styleUrl: './autenticacion-layout.css',
})
export class AutenticacionLayout {
  protected readonly title = signal('Backoffice Usuario');
}
