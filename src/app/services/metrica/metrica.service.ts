import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetricaService {
  private metricaApiUrl: string = environment.metricaApiUrl;

  constructor(private http: HttpClient) { }

  obtenerMetricas(filtersValues: {[key: string]: string | number | boolean}): Observable<Array<any>> {
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

    return this.http.post<any>(
      url,
      JSON.stringify(body),
      httpOptions).pipe(map(data => { 
        return data
      }))
  }

}
