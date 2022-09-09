import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LicenciaService } from 'src/app/services/licencia/licencia.service';
import { Licencia } from 'src/app/models/licencia.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { Modulo } from 'src/app/models/modulo.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileQuery: MediaQueryList;

  fillerNav = ['Inicio', 'Modulos'];

  public modulos: Array<Modulo>;
  public usuario: Usuario;
  private licencia: Licencia;

  private _mobileQueryListener: () => void;

  constructor(public moduloService: ModuloService, private licenciaService: LicenciaService, private usuarioService: UsuarioService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.usuario = new Usuario();
    this.modulos = [];
    this.licencia = new Licencia();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.licencia = this.licenciaService.obtenerLicencia();
    this.usuario = this.usuarioService.obtenerUsuario();

    if (this.usuarioService.usuarioLogueado()){
      this.obtenerModulos();
    } else {
      this.router.navigateByUrl('/login');
    }
    
  }

  obtenerModulos(){
    this.moduloService.obtenerModulosPorAlias(this.licencia.alias)
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
