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

  mobileQuery: MediaQueryList;

  fillerNav = ['Inicio', 'Modulos'];

  public modulos: Array<Modulo>;
  public usuarioNombreCompleto: string = '';
  private alias: string = '';

  private _mobileQueryListener: () => void;

  constructor(public moduloService: ModuloService, private licenciaService: LicenciaService, private usuarioService: UsuarioService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.modulos = [];
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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

  cerrarSesion(){
    this.usuarioService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }

}
