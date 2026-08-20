import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  constructor(private http: HttpClient) {}

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
}
