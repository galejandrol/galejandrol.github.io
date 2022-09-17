import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import servicios_realizados from './servicios_realizados.json';

interface ServicioRealizado {
  cliente: string,
  rubro: string,
  zona: string,
  grado: string,
  fecha: string
}

@Component({
  selector: 'app-metrica',
  templateUrl: './metrica.component.html',
  styleUrls: ['./metrica.component.css']
})

export class MetricaComponent implements OnInit {

  servicios: Array<ServicioRealizado> = servicios_realizados;
  routeSub: Subscription = new Subscription();
  public metricId: string = '';
  asd: Array<any> = [];

  single: any[] = [];
  multi: any[] = [];
  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Grado Operativo';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad';
  legendTitle = "Referencia";

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.metricId = params['id']; //log the value of id
    });

    const grados = Array.from(new Set(this.servicios.map(item => item.grado)));
    grados.forEach( (grado) => {
      const gradoCantidad = this.servicios.filter((obj) => obj.grado === grado).length;
      this.asd.push({"name": grado, "value": gradoCantidad})
    })
  }

  mostrarListaDeModulos(){
    this.router.navigateByUrl('/home');
/*     let modulosListDiv = document.getElementById('modulosList') as HTMLDivElement;
    let metricaModuloDiv = document.getElementById('metricaModulo') as HTMLDivElement;
    metricaModuloDiv.style.display = 'none';
    modulosListDiv.style.display = 'block'; */
  }

}
