import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filtro } from 'src/app/models/filtro.model';
import { FiltroService } from 'src/app/services/filtro/filtro.service';
import { MetricaService } from 'src/app/services/metrica/metrica.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})

export class FiltroComponent implements OnInit {

  filtersHtmlId: {[key: string]: string} = {
    "GradosOperativos": "gradoOperativoId",
    "RubrosClientes": "rubroId",
    "ZonasGeograficas": "zonaGeograficaId",
    "rangoDeFechas": "rangoDeFechas"
  }

  @Input() metricId: string = '';
  @Output() sendMetricas = new EventEmitter<Array<any>>();
  mostrarFiltroFechaPersonalizada: boolean = false;

  range = new FormGroup({
    fechaDesde: new FormControl<Date | null>(null),
    fechaHasta: new FormControl<Date | null>(null),
  });

  filtros: Array<Filtro> = [];

  private dateFilter: Filtro = {
    label: "Fecha",
    name: "rangoDeFechas",
    filterOptions: [
      {
        id: `${this.getDateByDaysAgo(0)}-${this.getDateByDaysAgo(0)}`,
        descripcion: "HOY"
      },
      {
        id: `${this.getDateByDaysAgo(7)}-${this.getDateByDaysAgo(0)}`,
        descripcion: "UNA SEMANA"
      },
      {
        id: `${this.getDateByDaysAgo(30)}-${this.getDateByDaysAgo(0)}`,
        descripcion: "UN MES (30 DIAS)"
      },
      {
        id: 'PERSONALIZADA',
        descripcion: "PERSONALIZADA"
      },
    ]
  }

  filtrosSeleccionados = new Map<string, string | number | boolean>([
    ["clienteId", 0],
    ["includeAnulados", true],
    ["includeNoAtendidos", true],
    ["rangoDeFechas", `${this.getDateByDaysAgo(0)}-${this.getDateByDaysAgo(0)}`]
  ]);

  constructor(private filtroService: FiltroService, private metricaService: MetricaService) { }

  ngOnInit(): void {
    this.filtroService.obtenerOpcionesDeFiltros()
    .subscribe({
      next: (filtrosOpcionesArray) => {
        this.filtros = filtrosOpcionesArray;
        this.filtros.push(this.dateFilter);
      },
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    })

    this.filtrosSeleccionados.set('metricId', this.metricId);
  }

  aplicarFiltro(): void {
    if (this.validDatePickerRangeValues()) {
        this.filtrosSeleccionados.set('rangoDeFechas', `${this.range.controls.fechaDesde.value!.toLocaleDateString()}-${this.range.controls.fechaHasta.value!.toLocaleDateString()}`);
    }

    this.metricaService.obtenerMetricas(Object.fromEntries(this.filtrosSeleccionados))
    .subscribe({
      next: (metricas) => {
        this.sendMetricas.emit(metricas);
      },
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    });
  }

  select(event: any){
    let htmlElementId = event.source.id;
    let value = (typeof event.value === 'undefined') ? event.checked : event.value;
    
    if (htmlElementId === 'rangoDeFechas') {
      if (value === 'PERSONALIZADA') {
        this.mostrarFiltroFechaPersonalizada = true;
      } else {
        this.mostrarFiltroFechaPersonalizada = false;
        this.range.controls.fechaDesde.reset();
        this.range.controls.fechaHasta.reset();
      }
    }

    console.log(htmlElementId);
    this.filtrosSeleccionados.set(htmlElementId, value);

    //console.log(JSON.stringify(Object.fromEntries(this.prueba)));
/*     let filtroNames = this.filtrosSeleccionados.map(function(a) {return a.filtro;});
    

    if (filtroNames.includes(htmlElementId)) {
      let index = filtroNames.indexOf(htmlElementId);
      this.filtrosSeleccionados[index].value = value;
    } else {
      this.filtrosSeleccionados.push({
        filtro: htmlElementId,
        value: value
      })
    } */
    
  }

  private getDateByDaysAgo(days: number): string {
    const now = new Date();
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toLocaleDateString();
  }

  private validDatePickerRangeValues(): boolean {
    return (this.mostrarFiltroFechaPersonalizada &&
      this.range.controls.fechaDesde.valid &&
      this.range.controls.fechaHasta.valid &&
      this.range.controls.fechaDesde.value != null &&
      this.range.controls.fechaHasta.value != null);
  }
}
