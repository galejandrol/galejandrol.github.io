import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

import { Licencia } from 'src/app/models/licencia.model';

import { LicenciaService } from 'src/app/services/licencia/licencia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  licencia: Licencia = new Licencia();
  alias: string = '';
  username: string = '';
  password: string = '';
  connectionString: string = '';
  showSpinner: boolean = false;

  constructor(private licenciaService: LicenciaService, private usuarioService: UsuarioService, private snackBar: MatSnackBar, private router: Router) {}

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
    this.showSpinner = true;
    this.licenciaService.validarAlias(this.alias)
      .subscribe({
        next: (licencia) => {

          this.licencia = licencia;
          this.licencia.alias = this.alias;
  
          let hoy = new Date();
          let fechaDeVencimiento = new Date(licencia.fechaDeVencimiento.replace(/ /g, "T"));
  
          if (fechaDeVencimiento >= hoy){
  
            let diferenciaEnMilisegundos = fechaDeVencimiento.getTime() - hoy.getTime();
            let diferenciaEnDias = Math.round(diferenciaEnMilisegundos / (1000 * 3600 * 24));

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
            this.showSpinner = false;
            this.snackBar.open(`Su licencia se encuentra vencida. Contactar a su proveedor`, "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (err) => {
          if (err.status === 404){
            this.showSpinner = false;
            this.snackBar.open('La empresa seleccionada es inexistente o no tiene accesibilidad remota', "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          } else {
            console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
          }
        }
      });
  }

  validarCredencialesDelUsuario() {
    this.usuarioService.validarCredenciales(this.licencia, this.username, this.password)
    .subscribe({
      next: (usuario) => {
        this.licenciaService.guardarLicencia(this.licencia);
        this.usuarioService.guardarNombreDeUsuario(usuario);
        this.router.navigateByUrl("/home");
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBar.open(err.error.loginError, "Cerrar", {
            duration: 3000,
            panelClass: ['error-snackbar']
          })
        } else {
          console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
        }
      }
    }).add(() => {
      this.showSpinner = false;
    })
  }
}
