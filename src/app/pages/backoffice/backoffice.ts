import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../partials/backoffice/sidebar/sidebar';
import { Topbar } from '../../partials/backoffice/topbar/topbar';
import { Footer } from '../../partials/backoffice/footer/footer';

@Component({
  selector: 'backoffice-root',
  imports: [RouterOutlet, Topbar, Sidebar, Footer],
  templateUrl: './backoffice.html',
  styleUrl: './backoffice.css',
})
export class Backoffice {
  protected readonly title = signal('Backoffice');
}
