import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filtro } from 'src/app/models/filtro.model';


@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  //private metricaApiUrl: string = 'https://localhost:5001/api/Metric';
  private metricaApiUrl: string = 'https://gestion.paramedic-pilar.com.ar/metrics/api/Metric';

  constructor(private http: HttpClient) { }

  obtenerOpcionesDeFiltros(): Observable<Array<Filtro>> {
    const aliasCnnString = localStorage.getItem('aliasCnnString');
    const url = `${this.metricaApiUrl}/getFiltersOptions`
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = {
      connectionString: aliasCnnString,
      filtersName: ['Grados Operativos', 'Rubros', 'Zonas']
    }
    
    return this.http.post<Array<Filtro>>(
      url,
      JSON.stringify(body),
      httpOptions)
  }
}
