import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CargarRecursosService } from '../services/cargar-recursos.service';
import { PaquetesService } from '../services/paquetes.service';
import { Topbar } from '../partials/topbar/topbar';
import { Sidebar } from '../partials/sidebar/sidebar';
import { tap } from 'rxjs/operators';

const $ = (window as any).$;

declare const Toastify: any;

const ESTILOS_DATATABLE = [
  '/assets/libs/jquery-datatable/css/dataTables.bootstrap5.min.css',
  '/assets/libs/jquery-datatable/css/responsive.bootstrap.min.css',
  '/assets/libs/jquery-datatable/css/buttons.dataTables.min.css',
];

const SCRIPTS_DATATABLE = [
  '/assets/libs/jquery-datatable/js/jquery.dataTables.min.js',
  '/assets/libs/jquery-datatable/js/dataTables.bootstrap5.min.js',
  '/assets/libs/jquery-datatable/js/dataTables.responsive.min.js',
  '/assets/libs/jquery-datatable/js/dataTables.buttons.min.js',
  '/assets/libs/jquery-datatable/js/buttons.print.min.js',
  '/assets/libs/jquery-datatable/js/buttons.html5.min.js',
  '/assets/libs/jquery-datatable/js/pdfmake.min.js',
  '/assets/libs/jquery-datatable/js/vfs_fonts.min.js',
  '/assets/libs/jquery-datatable/js/jszip.min.js',
];

@Component({
  selector: 'home-root',
  imports: [Topbar, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly title = signal('zoom-web');

  private readonly paquetesService = inject(PaquetesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly cargarRecursos = inject(CargarRecursosService);

  private datatable_listado_paquetes: any;

  private estado: string = '';

  public async ngOnInit(): Promise<void> {
    try {
      await this.cargarRecursos.cargarEstilos(ESTILOS_DATATABLE);
      await this.cargarRecursos.cargarScripts(SCRIPTS_DATATABLE);
    } catch (error) {
      console.warn('No se pudieron cargar los recursos del DataTable:', error);

      return;
    }

    if (typeof (window as any).$ === 'undefined') {
      console.warn('jQuery not available, skipping DataTable init');

      return;
    }

    this.inicializarDataTableListadoPaquetes(this.estado);

    this.formularioCrearPaquete();
  }

  /**
   * Datatable Listado de Paquetes
   * @private
   */
  private inicializarDataTableListadoPaquetes(estado: string): void {
    if ($.fn.DataTable && $.fn.dataTable.isDataTable('.js-listado-paquetes')) {
      this.datatable_listado_paquetes.destroy();
    }

    this.datatable_listado_paquetes = $('.js-listado-paquetes').DataTable({
      processing: true,
      serverSide: true,
      paging: true,
      ordering: true,
      lengthMenu: [
        [10, 25, 50, 100],
        [10, 25, 50, 100],
      ],
      ajax: (dataTablesParameters: any, callback: (data: any) => void) => {
        // Consultado (08-2026) en: https://l-lin.github.io/angular-datatables/#/basic/new-server-side
        // console.log(dataTablesParameters);
        this.paquetesService
          .obtenerPaquetes(
            estado,
            dataTablesParameters.start,
            dataTablesParameters.search.value,
            dataTablesParameters.length,
            dataTablesParameters.order[0].dir,
          )
          .subscribe((res: any) => {
            this.cdr.detectChanges();

            if (res.statusCode === 200) {
              callback({
                draw: Number(dataTablesParameters.draw),
                recordsTotal: res.data[0].total_paquetes,
                recordsFiltered: res.data[0].total_paquetes,
                data: res.data[0].listado_paquetes,
              });
            } else {
              callback({
                draw: Number(dataTablesParameters.draw),
                recordsTotal: 0,
                recordsFiltered: 0,
                data: 1,
              });
            }
          });
      },
      columns: [
        { data: 'id' },
        { data: 'codigo_guia' },
        { data: 'destinatario' },
        { data: 'ciudad_destino' },
        { data: 'peso_kg' },
        { data: 'estado' },
        { data: 'creado_en' },
      ],
      columnDefs: [
        {
          targets: [2, 3, 4, 5, 6],
          orderable: false,
        },
        {
          targets: [0],
          visible: false,
          searchable: false,
        },
      ],
      searching: true,
      dom: 'Bfrtip',
      responsive: true,
      language: {
        url: '/assets/libs/jquery-datatable/language/Spanish.json', // trabajar cualquier ambiente
        buttons: {
          // Consultado (01-2016) en: https://datatables.net/extensions/buttons/examples/flash/copyi18n.html
          copyTitle: 'Copiado al portapapeles',
          copySuccess: {
            // Consultado (01-2016) en: https://datatables.net/reference/button/copyHtml5
            1: 'Copiada una fila al portapapeles',
            _: 'Copiadas %d filas al portapapeles',
          },
        },
        sLength: 'dataTables_length',
      },
      buttons: [
        {
          extend: 'copy',
          text: 'Copiar',
          exportOptions: {
            modifier: {
              page: 'all',
            },
            columns: [1, 2, 3, 4, 5, 6],
          },
        },
        {
          extend: 'csv',
          text: 'CSV',
          //title: $("#title").val(),
          exportOptions: {
            modifier: {
              search: 'none',
            },
            columns: [1, 2, 3, 4, 5, 6],
          },
        },
        {
          extend: 'excel',
          text: 'Descargar Excel',
          // title: $("#title").val(),
          exportOptions: {
            modifier: {
              page: 'all',
            },
            columns: [1, 2, 3, 4, 5, 6],
          },
        },
        {
          extend: 'pdf',
          text: 'PDF',
          // title: $("#title").val(),
          pageSize: 'LETTER',
          exportOptions: {
            modifier: {
              page: 'all',
            },
            columns: [1, 2, 3, 4, 5, 6],
          },
        },
        {
          extend: 'print',
          text: 'Imprimir',
          // title: $("#title").val(),
          pageSize: 'LETTER',
        },
      ],
    });
  }

  /**
   * Formulario Crear Paquete
   * @private
   */
  private formularioCrearPaquete(): void {
    const formularioCrearPaqueteThis = this;

    $('#form_crear_paquete').validate({
      highlight: function (input: unknown) {
        // console.log(input as any);
        $(input as any)
          .parents('.form-line')
          .addClass('error');
      },
      unhighlight: function (input: unknown) {
        $(input as any)
          .parents('.form-line')
          .removeClass('error');
      },
      errorPlacement: function (error: unknown, element: unknown) {
        $(element as any)
          .parents('.input-group-lg')
          .append(error);
      },
      submitHandler: function (form: HTMLFormElement) {
        const payload = {
          codigo_guia: $(form).find('[id="codigo_guia"]').val(),
          destinatario: $(form).find('[id="destinatario"]').val(),
          ciudad_destino: $(form).find('[id="ciudad_destino"]').val(),
          peso_kg: $(form).find('[id="peso_kg"]').val(),
          estado: $(form).find('[id="estado"]').val(),
        };

        formularioCrearPaqueteThis.paquetesService
          .crearPaquete(payload)
          .pipe(
            tap(() => {
              // formularioCrearPaqueteThis.isLoading = true;
              // console.log('beforeSend: Spinner activated, UI disabled.');
              $('.button-crear-paquete').attr('disabled', true);

              $('.text-send').css('display', 'none');

              $('.button-crear-paquete').addClass('btn-load');

              $('.spinner-border').css('display', 'block');
              $('.flex-grow-1').css('display', 'block');
            }),
            tap({
              next: (response: any) => {
                // formularioCrearPaqueteThis.isLoading = false;
                // console.log('Success callback: Data saved!', response);

                if (response.statusCode === 201) {
                  $('.crear-paquete-modal-xl').modal('hide');

                  Toastify({
                    text: response.message,
                    duration: 5000,
                    position: 'center',
                    style: {
                      background: '#4FCBB5',
                    },
                  }).showToast(); //Consulted (12-2023) in: https://apvarun.github.io/toastify-js/, https://github.com/apvarun/toastify-js/blob/master/README.md

                  $('#form_crear_paquete')[0].reset();
                  $(form).find('[id="codigo_guia"]').val(null);
                  $(form).find('[id="destinatario"]').val(null);
                  $(form).find('[id="ciudad_destino"]').val(null);
                  $(form).find('[id="peso_kg"]').val(null);

                  formularioCrearPaqueteThis.inicializarDataTableListadoPaquetes(
                    formularioCrearPaqueteThis.estado,
                  );
                } else {
                  let message_text;
                  if (response.errors !== undefined) {
                    message_text = response.errors.join(',\n');
                  } else {
                    message_text = response.message;
                  }

                  Toastify({
                    text: message_text,
                    duration: 5000,
                    position: 'center',
                    style: {
                      background: '#EF6548',
                    },
                  }).showToast(); //Consulted (12-2023) in: https://apvarun.github.io/toastify-js/, https://github.com/apvarun/toastify-js/blob/master/README.md
                }

                $('.button-crear-paquete').attr('disabled', false);

                $('.text-send').css('display', 'block');

                $('.button-crear-paquete').removeClass('btn-load');

                $('.spinner-border').css('display', 'none');
                $('.flex-grow-1').css('display', 'none');
              },
              error: (error: any) => {
                // formularioCrearPaqueteThis.isLoading = false;
                // console.error('Error callback:', error);

                Toastify({
                  text: 'Error: ' + error.message,
                  duration: 5000,
                  position: 'center',
                  style: {
                    background: '#EF6548',
                  },
                }).showToast(); //Consulted (12-2023) in: https://github.com/apvarun/toastify-js/blob/master/README.md

                $('.button-crear-paquete').attr('disabled', false);

                $('.text-send').css('display', 'block');

                $('.button-crear-paquete').removeClass('btn-load');

                $('.spinner-border').css('display', 'none');
                $('.flex-grow-1').css('display', 'none');
              },
            }),
          )
          .subscribe();

        return false;
      },
    });
  }

  public paquetesPorEstado(event: Event): void {
    // this.inicializarDataTableListadoPaquetes($('#encontrar_por_estado').val());
    const element = event.target as HTMLInputElement;
    // console.log('New Value:', element.value);
    this.inicializarDataTableListadoPaquetes(element.value);
  }
}
