import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filtro } from 'src/app/models/filtro.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  private metricaApiUrl: string = environment.metricaApiUrl;

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
