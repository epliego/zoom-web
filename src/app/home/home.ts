import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { PaquetesService } from '../services/paquetes.service';

@Component({
  selector: 'home-root',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly title = signal('zoom-web');

  public datatable_listado_paquetes: any;

  constructor(
    private paquetesService: PaquetesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof (window as any).$ === 'undefined') {
      console.warn('jQuery not available, skipping DataTable init');

      return;
    }

    const $ = (window as any).$;

    // INICIO. Datatable Listado de Paquetes
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
            '',
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
                    page: 'all'
                },
                columns: [1, 2, 3, 4, 5, 6]
            }
        },
        {
            extend: 'csv',
            text: 'CSV',
            //title: $("#title").val(),
            exportOptions: {
                modifier: {
                    search: 'none'
                },
                columns: [1, 2, 3, 4, 5, 6]
            }
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
        // {
        //     extend: 'pdf',
        //     text: 'PDF',
        //     // title: $("#title").val(),
        //     pageSize: 'LETTER',
        //     exportOptions: {
        //         modifier: {
        //             page: 'all'
        //         },
        //         columns: [1, 2, 3, 4, 5, 6]
        //     }
        // },
        {
            extend: 'print',
            text: 'Imprimir',
            // title: $("#title").val(),
            pageSize: 'LETTER'
        }
      ],
    });
    // FIN. Datatable Listado de Paquetes
  }
}
