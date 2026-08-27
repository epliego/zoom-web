import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './partials/sidebar/sidebar';
import { Topbar } from './partials/topbar/topbar';
import { Footer } from './partials/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar, Sidebar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('zoom-web');
}
