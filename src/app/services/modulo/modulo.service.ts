import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Licencia } from 'src/app/models/licencia.model';
import { Modulo } from 'src/app/models/modulo.model';
import { environment } from 'src/environments/environment';
import { LicenciaService } from '../licencia/licencia.service';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private aliasApiURL: string = environment.aliasApiURL;

  constructor(private http: HttpClient) {}

  obtenerModulosPorAlias(alias: string){
    return this.http.get<Array<Modulo>>(`${this.aliasApiURL}/${alias}/modulos`);
  }
}
