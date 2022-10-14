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

  private diasRestantesParaElVencimiento: number = 20;
  licencia: Licencia = new Licencia();
  alias: string = '';
  username: string = '';
  password: string = '';
  connectionString: string = '';
  showSpinner: boolean = false;
  public hide: boolean = true;

  constructor(private licenciaService: LicenciaService, private usuarioService: UsuarioService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    if (this.usuarioService.usuarioLogueado()){
      this.router.navigateByUrl("/home");
    }
  }

  //Valido inputs y luego contra la API de Licencias (Shaman License API).
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

          let hoy = new Date();

          // Normalizo la fecha de vencimiento que viene de la API a ISO8601 para compatibilidad con Safari.
          let fechaDeVencimiento = new Date(licencia.fechaDeVencimiento.replace(/ /g, "T"));
  
          // Chequeo si la licencia está vigente.
          if (fechaDeVencimiento >= hoy){
  
            let diferenciaEnMilisegundos = fechaDeVencimiento.getTime() - hoy.getTime();
            let diferenciaEnDias = Math.round(diferenciaEnMilisegundos / (1000 * 3600 * 24));

            // Si la licencia está vigente pero quedan menos días que los declarados en la variable
            // diasRestantesParaElVencimiento se muestra un aviso al cliente durante 3 segundos y se procede a validar el login.
            if (diferenciaEnDias < this.diasRestantesParaElVencimiento) {
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

            this.showSpinner = false;
          }
        },
        error: (err) => {
          if (err.status === 404){
            this.snackBar.open('La empresa seleccionada es inexistente o no tiene accesibilidad remota', "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });

            this.showSpinner = false;
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

          this.showSpinner = false;
        } else {
          console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
        }
      }
    })
  }
}
