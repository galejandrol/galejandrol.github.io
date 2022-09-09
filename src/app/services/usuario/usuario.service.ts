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
  private usuario: Usuario;


  constructor(private http: HttpClient) { 
    this.usuario = new Usuario();
  }

  validarCredenciales(licencia: Licencia, usuario: string, password: string): Observable<Usuario>{
    const body = {
      ConnectionString: licencia.connectionString,
      UserName: usuario,
      Password: password
    }

    return this.http.post<Usuario>(
      `${this.aliasApiURL}/${licencia.alias}/login`,
      JSON.stringify(body),
      {
        headers: {
        'Content-Type': 'application/json'
        },
      })
  }

  guardarUsuario(usuario: Usuario){
    this.usuario = usuario;
  }

  usuarioLogueado(): boolean{
    return this.usuario.logueado;
  }

  obtenerUsuario(): Usuario {
    return this.usuario;
  }

  cerrarSesion() {
    this.usuario = new Usuario();
  }

}
