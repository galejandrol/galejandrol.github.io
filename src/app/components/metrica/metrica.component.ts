import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrica',
  templateUrl: './metrica.component.html',
  styleUrls: ['./metrica.component.css'],
})

export class MetricaComponent implements OnInit {
  routeSub: Subscription = new Subscription();
  metricId: string = '';
  metricas: Array<{[key: string]: string | number}> = [];
  customColors: Array<{[key: string]: string}> = [];
  showSpinner = true;

  // Opciones del gráfico de barra.
  view: [number, number] = [0,0];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';

  // La API (Shaman Metrics) me devuelve un json en base a un dataset obtenido con el store procedure genérico para todas las métricas.
  // Con estas estructuras parseo esa respuesta para adaptarlo según la métrica seleccionada.
  private parseMetricsResults: {[key: string]: any} = {
    //Servicios Realizados
    "00": {
      "name": "Grado",
      "value": "Cantidad",
      "color": "ColorHexa",
      "xAxisLabel": "Grado Operativo",
      "yAxisLabel": "Cantidad"
    },
    //Tiempos Operativos
    "01": {
      "name": "Grado",
      "value": "TpoDespacho",
      "color": "ColorHexa",
      "xAxisLabel": "Grado Operativo",
      "yAxisLabel": "Cantidad"
    },
    //Ranking Clientes
    "02": {
      "name": "RazonSocial",
      "value": "Cantidad",
      "xAxisLabel": "Cliente",
      "yAxisLabel": "Cantidad"
    },
    //Servicios Moviles
    "03": {
      "name": "Movil",
      "value": "Cantidad",
      "xAxisLabel": "Movil",
      "yAxisLabel": "Cantidad"
    },
    //Servicios Empresas
    "04": {
      "name": "RazonSocial",
      "value": "Cantidad",
      "xAxisLabel": "Razon Socia",
      "yAxisLabel": "Cantidad"
    }
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Seteo el ancho del grafico de barra con el 70% del ancho de la pantalla y un alto de 400px.
    this.view = [innerWidth / 1.3, 400];
  }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.metricId = params['id'];
    });
  }

  onResize(event: any) {
    // Mantengo el gráfico de barra con un ancho del 70% del ancho de la pantalla y un alto de 400px.
    this.view = [event.target.innerWidth / 1.3, 400];
  }

  actualizarMetricas(metricas: Array<{[key: string]: string | number}>) {
    let newMetrics: Array<{[key: string]: string | number}> = [];
    let newMetricsColors: Array<{[key: string]: string}> = [];

    metricas.forEach((element: any) => {

      // Si la métrica obtenida de la API contiene un campo Color lo uso y sino genero un color random.
      let color: string = element[this.parseMetricsResults[this.metricId]["color"]] || Math.floor(Math.random()*16777215).toString(16);

      newMetrics.push({
        "name": element[this.parseMetricsResults[this.metricId]["name"]],
        "value": element[this.parseMetricsResults[this.metricId]["value"]]
      });

      newMetricsColors.push({
        "name": element[this.parseMetricsResults[this.metricId]["name"]],
        "value": "#" + color
      })

    });

    this.customColors = [...newMetricsColors];
    this.metricas = [...newMetrics];
    this.xAxisLabel = this.parseMetricsResults[this.metricId]['xAxisLabel'];
    this.yAxisLabel = this.parseMetricsResults[this.metricId]['yAxisLabel'];
    this.showSpinner = false;
  }

  filtroShowSpinner(showSpinner: boolean): void {
    this.showSpinner = showSpinner;
  }

  mostrarListaDeModulos(){
    this.router.navigateByUrl('/home');
  }

}
