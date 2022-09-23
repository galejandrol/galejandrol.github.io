import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Licencia } from 'src/app/models/licencia.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService {
  private aliasApiURL: string = environment.aliasApiURL;

  constructor(private http: HttpClient) {}

  obtenerTodosLosAlias(): Observable<string[]>{
    return this.http.get<string[]>(this.aliasApiURL);
  }

  validarAlias(alias: string): Observable<Licencia>{
    const validarAliasUrl = `${this.aliasApiURL}/${alias}/validation`;
    return this.http.get<Licencia>(validarAliasUrl);
  }

  guardarLicencia(licencia: Licencia){
    localStorage.setItem('alias', licencia.alias);
    localStorage.setItem('aliasCnnString', licencia.connectionString);
  }

  obtenerAlias(): string{
    return localStorage.getItem('alias')!;
  }

}
