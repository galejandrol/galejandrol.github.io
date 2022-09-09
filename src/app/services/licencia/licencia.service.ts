import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Licencia } from 'src/app/models/licencia.model';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService {
  private aliasApiURL: string = 'https://localhost:6001/api/v1/Licenses/Alias';
  private licencia: Licencia;

  constructor(private http: HttpClient) { 
    this.licencia = new Licencia();
  }

  obtenerTodosLosAlias(): Observable<string[]>{
    return this.http.get<string[]>(this.aliasApiURL);
  }

  validarAlias(alias: string): Observable<Licencia>{
    return this.http.get<Licencia>(`${this.aliasApiURL}/${alias}/validation`);
  }

  guardarLicencia(licencia: Licencia){
    this.licencia = licencia;
  }

  obtenerLicencia(): Licencia{
    return this.licencia;
  }

}
