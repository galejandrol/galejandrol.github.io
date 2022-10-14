import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LicenciaService } from 'src/app/services/licencia/licencia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { Modulo } from 'src/app/models/modulo.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public modulos: Array<Modulo>;
  public usuarioNombreCompleto: string = '';
  private alias: string = '';
  public metricaSeleccionada: string = '';
  showSpinner: boolean = true;

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
      next: (modulos) => {
        this.modulos = modulos;
        this.showSpinner = false;
      },
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    })
  }

  mostrarMetricaDelModulo(codigo: string){
    this.router.navigateByUrl(`/modulos/${codigo}`)
  }
  
  cerrarSesion(){
    this.usuarioService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }

}
