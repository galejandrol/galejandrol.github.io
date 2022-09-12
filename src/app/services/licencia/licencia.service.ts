import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Licencia } from 'src/app/models/licencia.model';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService {
  private aliasApiURL: string = 'https://localhost:6001/api/v1/Licenses/Alias';

  constructor(private http: HttpClient) {}

  obtenerTodosLosAlias(): Observable<string[]>{
    return this.http.get<string[]>(this.aliasApiURL);
  }

  validarAlias(alias: string): Observable<Licencia>{
    const validarAliasUrl = `${this.aliasApiURL}/${alias}/validation`;
    return this.http.get<Licencia>(validarAliasUrl);
  }

  guardarAlias(alias: string){
    localStorage.setItem('alias', alias);
  }

  obtenerAlias(): string{
    return localStorage.getItem('alias')!;
  }

}
