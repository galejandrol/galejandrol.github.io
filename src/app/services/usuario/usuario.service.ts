import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Licencia } from 'src/app/models/licencia.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private aliasApiURL: string = 'https://localhost:6001/api/v1/Licenses/Alias';

  constructor(private http: HttpClient) {}

  validarCredenciales(licencia: Licencia, usuario: string, password: string): Observable<Usuario>{
    const loginUrl = `${this.aliasApiURL}/${licencia.alias}/login`
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const body = {
      ConnectionString: licencia.connectionString,
      UserName: usuario,
      Password: password
    }

    return this.http.post<Usuario>(
      loginUrl,
      JSON.stringify(body),
      httpOptions)
  }

  guardarNombreDeUsuario(usuario: Usuario){
    localStorage.setItem('usuarioActual', `{"nombreCompleto": "${usuario.nombre}"}`);
  }

  usuarioLogueado(): boolean{

    if (localStorage.getItem('usuarioActual')){
      return true;
    }

    return false;
  }

  obtenerNombreDeUsuario(): string {
    let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')!);
    return usuarioActual.nombreCompleto;
  }

  cerrarSesion() {
    localStorage.clear();
  }

}
