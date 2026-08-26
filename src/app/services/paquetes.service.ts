import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener los paquetes desde la API
   * @param estado
   * @param offset
   * @param search
   * @param limit
   * @param order
   */
  public obtenerPaquetes(
    estado: string = '',
    offset: string,
    search: string,
    limit: string,
    order: string,
  ) {
    return this.http.get(
      'http://localhost:3000/api/paquetes?estado=' +
        estado +
        '&offset=' +
        offset +
        '&search=' +
        search +
        '&limit=' +
        limit +
        '&order=' +
        order,
    );
  }

  /**
   * Crear un nuevo paquete
   * @param payload
   */
  public crearPaquete(payload: any) {
    return this.http.post('http://localhost:3000/api/paquetes', payload);
  }
}
