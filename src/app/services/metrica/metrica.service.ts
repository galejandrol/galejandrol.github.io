import { Injectable } from '@angular/core';
import { Metrica } from 'src/app/models/metrica.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MetricaService {
  //private metricaApiUrl: string = 'https://localhost:5001/api/Metric';
  private metricaApiUrl: string = 'https://gestion.paramedic-pilar.com.ar/metrics/api/Metric';

  constructor(private http: HttpClient) { }

  obtenerMetricas(filtersValues: {[key: string]: string | number | boolean}): Observable<Array<Metrica>> {
    const aliasCnnString = localStorage.getItem('aliasCnnString');
    const url = `${this.metricaApiUrl}/getMetrics`
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log(filtersValues);
    console.log(JSON.stringify(filtersValues));

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
