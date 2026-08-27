import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ver-paquete-root',
  imports: [],
  templateUrl: './ver-paquete.html',
  styleUrl: './ver-paquete.css',
})
export class VerPaquete {
  protected readonly title = signal('zoom-web');

  protected readonly paqueteId = signal<number | null>(null);
  private readonly route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    const idStr = this.route.snapshot.paramMap.get('id');
    const idNum = idStr ? Number(idStr) : NaN;
    this.paqueteId.set(Number.isFinite(idNum) ? idNum : null);
  }
}
