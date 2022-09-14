import { Component, OnInit } from '@angular/core';
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
  asd: Array<any> = [];

  single: any[] = [];
  multi: any[] = [];
  view: [number, number] = [700, 400];

  prueba = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    }
  ]

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Grado Operativo';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad';
  legendTitle = "Referencia"

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {}

  ngOnInit(): void {
    const grados = Array.from(new Set(this.servicios.map(item => item.grado)));
    grados.forEach( (grado) => {
      const gradoCantidad = this.servicios.filter((obj) => obj.grado === grado).length;
      this.asd.push({"name": grado, "value": gradoCantidad})
    })
  }

  mostrarListaDeModulos(){
    let modulosListDiv = document.getElementById('modulosList') as HTMLDivElement;
    let metricaModuloDiv = document.getElementById('metricaModulo') as HTMLDivElement;
    metricaModuloDiv.style.display = 'none';
    modulosListDiv.style.display = 'block';
  }

}
