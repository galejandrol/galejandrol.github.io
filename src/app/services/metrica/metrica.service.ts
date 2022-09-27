import { Injectable } from '@angular/core';
import { Metrica } from 'src/app/models/metrica.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter } from 'd3';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricaService {
  private metricaApiUrl: string = environment.metricaApiUrl;

  constructor(private http: HttpClient) { }

  obtenerMetricas(filtersValues: {[key: string]: string | number | boolean}): Observable<Array<Metrica>> {
    const aliasCnnString = localStorage.getItem('aliasCnnString');
    const url = `${this.metricaApiUrl}/getMetrics`
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = {
      connectionString: aliasCnnString,
      filtersValues: filtersValues
    }
    
    return this.http.post<Array<Metrica>>(
      url,
      JSON.stringify(body),
      httpOptions)
  }

}
