import { Component, signal } from '@angular/core';

@Component({
  selector: 'sidebar-root',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly title = signal('zoom-web');

  public async ngOnInit(): Promise<void> {}
}
