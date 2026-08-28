import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

const $ = (window as any).$;

@Component({
  selector: 'iniciar-sesion-root',
  imports: [],
  templateUrl: './iniciar_sesion.html',
  styleUrl: './iniciar_sesion.css',
})
export class IniciarSesion {
  protected readonly title = signal('Backoffice Usuario');

  private readonly router = inject(Router);

  // public onSubmit(event: Event): void {
  //   event.preventDefault();
  //   this.router.navigate(['/backoffice/paquetes']);
  // }

  public async ngOnInit(): Promise<void> {
    const ngOnInitThis = this;

    $('#form_backoffice_usuario_iniciar_sesion').validate({
      highlight: function (input: unknown) {
        // console.log(input as any);
        $(input as any).parents('.form-line').addClass('error');
      },
      unhighlight: function (input: unknown) {
        $(input as any).parents('.form-line').removeClass('error');
      },
      errorPlacement: function (error: unknown, element: unknown) {
        $(element as any).parents('.input-group-lg').append(error);
      },
      submitHandler: function (form: HTMLFormElement) {
        ngOnInitThis.router.navigate(['/backoffice/paquetes']);
      },
    });
  }
}
