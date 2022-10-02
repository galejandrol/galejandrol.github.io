import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filtro } from 'src/app/models/filtro.model';
import { FiltroService } from 'src/app/services/filtro/filtro.service';
import { MetricaService } from 'src/app/services/metrica/metrica.service';
import { ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})

export class FiltroComponent implements OnInit {

  @ViewChild('includeAnulados') private chkIncludeAnulados!: MatCheckbox;
  @ViewChild('includeNoAtendidos') private chkIncludeNoAtendidos!: MatCheckbox;

  @Input() metricId: string = '';
  @Output() showSpinner = new EventEmitter<boolean>();
  @Output() sendMetricas = new EventEmitter<Array<any>>();
  mostrarFiltroFechaPersonalizada: boolean = false;
  openPanelState = false;

  range = new FormGroup({
    fechaDesde: new FormControl<Date | null>(null),
    fechaHasta: new FormControl<Date | null>(null),
  });

  filtros: Array<Filtro> = [];

  private dateFilter: Filtro = {
    label: "Fecha",
    name: "rangoDeFechas",
    defaultValue: 0,
    filterOptions: [
      {
        value: 0,
        viewValue: "HOY"
      },
      {
        value: 7,
        viewValue: "UNA SEMANA"
      },
      {
        value: 30,
        viewValue: "UN MES (30 DIAS)"
      },
      {
        value: 'PERSONALIZADA',
        viewValue: "PERSONALIZADA"
      },
    ]
  }

  filtersHtmlId: {[key: string]: any} = {
    "GradosOperativos": "gradoOperativoId",
    "RubrosClientes": "rubroId",
    "ZonasGeograficas": "zonaGeograficaId",
    "rangoDeFechas": "rangoDeFechas",
  }

  dateFilterValues: {[key: string]: any} = {
    "0": `${this.getDateByDaysAgo(0)}-${this.getDateByDaysAgo(0)}`,
    "7": `${this.getDateByDaysAgo(7)}-${this.getDateByDaysAgo(0)}`,
    "30": `${this.getDateByDaysAgo(30)}-${this.getDateByDaysAgo(0)}`,
    "PERSONALIZADA": "PERSONALIZADA",
  }

  filtrosAplicados: Array<{[key: string]: string}> = [];
  filtrosAplicadosTemporal: Array<{[key: string]: string}> = [];

  filtrosSeleccionados = new Map<string, string | number | boolean>([
    ["clienteId", 0],
    ["rubroId", 0],
    ["zonaGeograficaId", 0],
    ["gradoOperativoId", 0],
    ["includeAnulados", true],
    ["includeNoAtendidos", true],
    ["rangoDeFechas", this.dateFilterValues["0"]]
  ]);

  constructor(private filtroService: FiltroService, private metricaService: MetricaService) {}

  ngOnInit(): void {
    this.obtenerFiltros();
  }

  obtenerFiltros(): void {
    this.filtroService.obtenerOpcionesDeFiltros()
    .subscribe({
      next: (filtrosOpcionesArray) => {
        this.filtros = filtrosOpcionesArray;
        this.filtros.push(this.dateFilter);

        this.metricaService.obtenerMetricas(Object.fromEntries(this.filtrosSeleccionados))
        .subscribe({
          next: (metricas) => {
            this.sendMetricas.emit(metricas);
          },
          error: (err) => {
            console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
          }
        });
      },
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    })

    this.filtrosSeleccionados.set('metricId', this.metricId);
  }

  aplicarFiltro(): void {
    this.showSpinner.emit(true);
    if (this.mostrarFiltroFechaPersonalizada) {
      if (this.validDatePickerRangeValues()) {
        let rangoDeFechas = `${this.range.controls.fechaDesde.value!.toLocaleDateString()}-${this.range.controls.fechaHasta.value!.toLocaleDateString()}`;
        this.openPanelState = false;
        this.filtrosSeleccionados.set('rangoDeFechas', rangoDeFechas);
        this.metricaService.obtenerMetricas(Object.fromEntries(this.filtrosSeleccionados))
        .subscribe({
          next: (metricas) => {
            this.sendMetricas.emit(metricas);
          },
          error: (err) => {
            console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
          }
        });

        this.filtrosAplicados = Object.assign([], this.filtrosAplicadosTemporal);
      }
    } else {
      this.openPanelState = false;
      this.metricaService.obtenerMetricas(Object.fromEntries(this.filtrosSeleccionados))
      .subscribe({
        next: (metricas) => {
          this.sendMetricas.emit(metricas);
        },
        error: (err) => {
          console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
        }
      });

      this.filtrosAplicados = Object.assign([], this.filtrosAplicadosTemporal);
    }

    
  }

  select(event: any){
    let htmlElementId = event.source.id;
    let value = (typeof event.value === 'undefined') ? (event.checked ? true : false) : (htmlElementId === 'rangoDeFechas' ? this.dateFilterValues[event.value] : event.value);
    let viewValue = (typeof event.source.selected === 'undefined') ? (value ? "SI" : "NO") : event.source.selected.viewValue;

    if (htmlElementId === 'rangoDeFechas') {
      if (value === 'PERSONALIZADA') {
        this.mostrarFiltroFechaPersonalizada = true;
      } else {
        this.mostrarFiltroFechaPersonalizada = false;
        this.range.controls.fechaDesde.reset();
        this.range.controls.fechaHasta.reset();
      }
    }

    this.filtrosSeleccionados.set(htmlElementId, value);

    let index = this.filtrosAplicadosTemporal.findIndex((element) => element['id'] == htmlElementId);

    let filtroAplicado = {
      "id": htmlElementId,
      "label": event.source.ariaLabel,
      "viewValue": viewValue
    }

    if (index != -1 ){
      this.filtrosAplicadosTemporal[index] = filtroAplicado;
    } else {
      this.filtrosAplicadosTemporal.push(filtroAplicado);
    }
  }

  remove(filtroAplicado: {[key: string]: string}){
    let indexFiltroAplicado = this.filtrosAplicados.findIndex((element) => element['id'] == filtroAplicado['id']);
    let indexFiltro = this.filtros.findIndex((element) => element.label == filtroAplicado['label']);
    let value: string | boolean | number = 0;

    this.filtrosAplicadosTemporal.splice(indexFiltroAplicado, 1);

    if (indexFiltro != -1){
      this.filtros[indexFiltro].defaultValue = 0;
    }

    switch(filtroAplicado['id']) { 
      case 'rangoDeFechas': {
        value = this.dateFilterValues["0"];
        if(filtroAplicado['viewValue'] === 'PERSONALIZADA') {
          this.mostrarFiltroFechaPersonalizada = false;
          this.range.controls.fechaDesde.reset();
          this.range.controls.fechaHasta.reset();
        }
        break; 
      }
      case 'includeAnulados': {
        value = true;
        this.chkIncludeAnulados.checked = true;
        break; 
      }
      case 'includeNoAtendidos': {
        value = true;
        this.chkIncludeNoAtendidos.checked = true;
        break; 
      }
      default: {
        //statements; 
        break; 
      } 
    }

    this.filtrosSeleccionados.set(filtroAplicado['id'], value);
    this.aplicarFiltro();
  }

  private getDateByDaysAgo(days: number): string {
    const now = new Date();
    return this.formatDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
  }

  private validDatePickerRangeValues(): boolean {
    return (
      this.range.controls.fechaDesde.valid &&
      this.range.controls.fechaHasta.valid &&
      this.range.controls.fechaDesde.value != null &&
      this.range.controls.fechaHasta.value != null
    );
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  
  private formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }
}
