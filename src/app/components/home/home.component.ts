import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LicenciaService } from 'src/app/services/licencia/licencia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { Modulo } from 'src/app/models/modulo.model';

interface Cliente {
  value: string;
  viewValue: string;
}

interface Rubros {
  value: string;
  viewValue: string;
}
interface Zonas {
  value: string;
  viewValue: string;
}
interface Clasificaciones {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clientes: Cliente[] = [
    {value: 'OSDE', viewValue: 'OSDE'},
    {value: 'SWISS MEDICAL', viewValue: 'SWISS MEDICAL'},
  ];

  rubros: Rubros[] = [
    {value: 'OSDE', viewValue: 'OSDE'},
    {value: 'SWISS MEDICAL', viewValue: 'SWISS MEDICAL'},
  ];

  zonas: Zonas[] = [
    {value: 'CABA', viewValue: 'CABA'},
    {value: 'GBA NORTE', viewValue: 'GBA NORTE'},
    {value: 'INTERIOR', viewValue: 'INTERIOR'},
  ];

  clasificaciones: Clasificaciones[] = [
    {value: 'CODIGO ROJO', viewValue: 'CODIGO ROJO'},
    {value: 'CODIGO AMARILLO', viewValue: 'CODIGO AMARILLO'},
    {value: 'VISITA', viewValue: 'VISITA'},
    {value: 'VISITA PRIORIZADA', viewValue: 'VISITA PRIORIZADA'},
  ];

  public modulos: Array<Modulo>;
  public usuarioNombreCompleto: string = '';
  private alias: string = '';

  constructor(public moduloService: ModuloService, private licenciaService: LicenciaService, private usuarioService: UsuarioService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.modulos = [];
  }

  ngOnInit(): void {
    if (this.usuarioService.usuarioLogueado()){
      this.usuarioNombreCompleto = this.usuarioService.obtenerNombreDeUsuario();
      this.alias = this.licenciaService.obtenerAlias();
      this.obtenerModulos();
    } else {
      this.router.navigateByUrl('/login');
    }   
  }

  obtenerModulos(){
    this.moduloService.obtenerModulosPorAlias(this.alias)
    .subscribe({
      next: (modulos) => this.modulos = modulos,
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    })
  }

  mostrarDetalleDelModulo(codigo: string){
    let modulosListDiv = document.getElementById('modulosList') as HTMLDivElement;
    let moduloDetalleDiv = document.getElementById('moduloDetalle') as HTMLDivElement;
    modulosListDiv.style.display = 'none';
    moduloDetalleDiv.style.display = 'block';
  }
  
  cerrarSesion(){
    this.usuarioService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }

}
