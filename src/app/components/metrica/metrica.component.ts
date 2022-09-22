import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrica',
  templateUrl: './metrica.component.html',
  styleUrls: ['./metrica.component.css']
})

export class MetricaComponent implements OnInit {

  routeSub: Subscription = new Subscription();
  metricId: string = '';
  metricas: Array<any> = [];  
  customColors: Array<any> = [];

  view: [number, number] = [0,0];

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }

  actualizarMetricas(metricas: any) {
    let newMetrics: Array<any> = [];
    let newMetricsColors: Array<any> = [];

    metricas.results.forEach((element: any) => {
      newMetrics.push({"name": element.name, "value": element.value});
      newMetricsColors.push({"name": element.name, "value": element.color})
    });

    this.customColors = [...newMetricsColors];
    this.metricas = [...newMetrics];

    console.log(this.metricas)
  }

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.view = [innerWidth / 1.3, 400];
  }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.metricId = params['id'];
    });
  }

  mostrarListaDeModulos(){
    this.router.navigateByUrl('/home');
  }

}
