import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

import { Licencia } from 'src/app/models/licencia.model';
import { Usuario } from 'src/app/models/usuario.model';

import { LicenciaService } from 'src/app/services/licencia/licencia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  licencia: Licencia;
  usuario: Usuario;
  alias: string;
  username: string;
  password: string;
  recordarme: boolean;

  constructor(private licenciaService: LicenciaService, private usuarioService: UsuarioService, private snackBar: MatSnackBar, private router: Router) {
    this.recordarme = false;
    this.alias = '';
    this.username = '';
    this.password = '';
    this.licencia = new Licencia();
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.usuarioService.usuarioLogueado()){
      this.router.navigateByUrl("/home");
    }
  }

  login(){
    if (this.username != '' && this.password != '' && this.alias != ''){
      this.validarAlias();
    }
  }

  validarAlias(){
    this.licenciaService.validarAlias(this.alias)
      .subscribe({
        next: (licencia) => {

          this.licencia = licencia;
          this.licencia.alias = this.alias;
          this.licenciaService.guardarLicencia(licencia);
  
          let hoy = new Date();
          let fechaDeVencimiento = new Date(licencia.fechaDeVencimiento);
  
          if (fechaDeVencimiento >= hoy){
  
            let diferenciaEnMilisegundos = fechaDeVencimiento.getTime() - hoy.getTime();
            let diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 3600 * 24);

            if (diferenciaEnDias < 20) {
              this.snackBar.open(`Faltan ${diferenciaEnDias} día/s para el vencimiento de la licencia`, "Cerrar", {
                duration: 3000,
                panelClass: ['warn-snackbar']
              });

              setTimeout(() => this.validarCredencialesDelUsuario(), 3000);
            } else {
              this.validarCredencialesDelUsuario();
            }
          } else {
            this.snackBar.open(`Su licencia se encuentra vencida. Contactar a su proveedor`, "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (err) => {
          if (err.status === 404){
            this.snackBar.open('La empresa seleccionada es inexistente o no tiene accesibilidad remota', "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          } else {
            console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
          }
        }
      })
  }

  validarCredencialesDelUsuario() {
    this.usuarioService.validarCredenciales(this.licencia, this.username, this.password)
    .subscribe({
      next: (usuario) => {
        usuario.logueado = true;
        this.usuarioService.guardarUsuario(usuario);
        this.router.navigateByUrl("/home");
      },
      error: (err) => {
        if (err.status === 401) {
          console.log(err)
          this.snackBar.open(err.error.loginError, "Cerrar", {
            duration: 3000,
            panelClass: ['error-snackbar']
          })
        } else {
          console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
        }
      }
    })
  }

/*   public async login(){
    const body = {
      ConnectionString: this.licencia.connectionString,
      UserName: this.username,
      Password: this.password
    }
  
    const response = await fetch(`https://localhost:6001/api/v1/Licenses/Alias/${this.licencia.alias}/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (response.ok){
      //localStorage.setItem('user', JSON.stringify({ info: result }));
      this.router.navigateByUrl("/home");

    } else if (response.status === 401) {
      this.snackBar.open(result['loginError'], "Cerrar", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } else {
      console.error(`HTTP ERROR - [CODE: ${response.status}], [MESSAGE: ${response.statusText}]`);
    }
  } */

}
