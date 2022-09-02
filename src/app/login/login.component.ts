import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  aliasList = [];
  username: string;
  password: string;
  aliasSelectedValue: string;

  constructor(private snackBar: MatSnackBar, private router: Router) {
    this.username = "";
    this.password = "";
    this.aliasSelectedValue = "";
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')){
      this.router.navigateByUrl("/home");
    }

    this.getAllAlias();
  }

  public async getAllAlias(){
    const response = await fetch('https://localhost:6001/api/v1/Licenses/Alias');
    
    if (response.ok){
      this.aliasList = await response.json();
    }
  }

  public async validarAlias(){
      try {
        const response = await fetch(`https://localhost:6001/api/v1/Licenses/Alias/${this.aliasSelectedValue}/validation`);

        if (!response.ok) {

          this._hideLoginControls();

          if (response.status === 404) {
            this.snackBar.open('La empresa seleccionada es inexistente o no tiene accesibilidad remota', "Cerrar", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          } else {
            console.error(`HTTP ERROR - [CODE: ${response.status}], [MESSAGE: ${response.statusText}]`);
          }

        } else {
          const result = await response.json();

          localStorage.setItem('licencia', JSON.stringify({ alias: this.aliasSelectedValue, info: result}));

          let hoy = new Date();
          let fechaDeVencimiento = new Date(result.fechaDeVencimiento);

          if (fechaDeVencimiento >= hoy){

            let differenceInMilliseconds = fechaDeVencimiento.getTime() - hoy.getTime();
            //let differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
            let differenceInDays = 1;
            if (differenceInDays < 20) {
              this.snackBar.open(`Faltan ${differenceInDays} días para el vencimiento de la licencia`, "Cerrar", {
                duration: 3000,
                panelClass: ['warn-snackbar']
              });
            }

            this._showLoginControls();
          }
        }
      } catch (err) {
        console.log(err);
      }
  }

  public async login(){

    if (this.username != '' && this.password != ''){

      const licencia = JSON.parse(localStorage.getItem('licencia') as string);
      const connectionString = licencia.info.connectionString;

      const body = {
        ConnectionString: connectionString,
        UserName: this.username,
        Password: this.password
      }

      const response = await fetch(`https://localhost:6001/api/v1/Licenses/Alias/${licencia.alias}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok){
        localStorage.setItem('user', JSON.stringify({ info: result }));

        this.router.navigateByUrl("/home");

      } else if (response.status === 401) {
        this.snackBar.open(result['loginError'], "Cerrar", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else {
        console.error(`HTTP ERROR - [CODE: ${response.status}], [MESSAGE: ${response.statusText}]`);
      }
    }
  }

  private _showLoginControls(){
    const div = document.getElementById('loginForm') as HTMLDivElement;
    div.setAttribute('style', 'display:block;');
  }

  private _hideLoginControls(){
    const div = document.getElementById('loginForm') as HTMLDivElement;
    div.setAttribute('style', 'display:none;');
  }

}
