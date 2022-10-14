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
  @Output() sendMetricas = new EventEmitter<Array<{[key: string]: string | number}>>();
  mostrarFiltroFechaPersonalizada: boolean = false;

  // Variable para manejar el expandir/colapsar del panel de los filtros.
  openPanelState = false;

  range = new FormGroup({
    fechaDesde: new FormControl<Date | null>(null),
    fechaHasta: new FormControl<Date | null>(null),
  });

  public filtros: Array<Filtro> = [];

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

  // Esta estructura es para 
  public filtersHtmlId: {[key: string]: any} = {
    "GradosOperativos": "gradoOperativoId",
    "RubrosClientes": "rubroId",
    "ZonasGeograficas": "zonaGeograficaId",
    "rangoDeFechas": "rangoDeFechas",
  }

  private dateFilterValues: {[key: string]: any} = {
    "0": `${this.getDateByDaysAgo(0)}-${this.getDateByDaysAgo(0)}`,
    "7": `${this.getDateByDaysAgo(7)}-${this.getDateByDaysAgo(0)}`,
    "30": `${this.getDateByDaysAgo(30)}-${this.getDateByDaysAgo(0)}`,
    "PERSONALIZADA": "PERSONALIZADA",
  }

  // Array que contiene los filtros que finalmente se encuentran aplicados.
  public filtrosAplicados: Array<{[key: string]: string}> = [];

  // Array que contiene los filtros que se van modificando antes de aplicarse.
  private filtrosAplicadosTemporal: Array<{[key: string]: string}> = [];

  // Seteo los valores por default para cada uno de los filtros
  private filtrosSeleccionados = new Map<string, string | number | boolean>([
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
        // Obtengo los filtros de la API (Shaman Metrics)
        this.filtros = filtrosOpcionesArray;

        // Le agrego el filtro custom de rango de Fechas
        this.filtros.push(this.dateFilter);

        // Hago la llamada inicial de las métricas
        this.metricaService.obtenerMetricas(Object.fromEntries(this.filtrosSeleccionados))
        .subscribe({
          next: (metricas) => {

            // Le envio las métricas al componente Metrica para actualizar.
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

    // Agrego el ID de la métrica al map de filtrosSeleccionados para que esté presente en el body usado en el call a la API para obtener las metricas.
    this.filtrosSeleccionados.set('metricId', this.metricId);
  }

  aplicarFiltro(): void {  
    let rangoDeFechas: string = '';

    // Realizo el call a la API sólo si:
      // - El filtro de fecha no está seteado en PERSONALIZADA ó
      // - El filtro de fecha está seteado en PERSONALIZADA y contiene un rango de fechas válido.
    if (!this.mostrarFiltroFechaPersonalizada || (this.mostrarFiltroFechaPersonalizada && this.validDatePickerRangeValues())){

      this.showSpinner.emit(true);
      this.openPanelState = false;

      // Si el caso es que el filtro de fecha está seteado en PERSONALIZADA y contiene un rango de fechas válido lo agrego a los filtros seleccionados.
      if (this.mostrarFiltroFechaPersonalizada && this.validDatePickerRangeValues()) {
        rangoDeFechas = `${this.range.controls.fechaDesde.value!.toLocaleDateString()}-${this.range.controls.fechaHasta.value!.toLocaleDateString()}`;
        this.filtrosSeleccionados.set('rangoDeFechas', rangoDeFechas);
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
  
      this.filtrosAplicados = this.filtrosAplicadosTemporal;
    }
  }

  // Metodo que maneja el onSelect de los filtros
  select(event: any){
    let htmlElementId = event.source.id;

    // Si el event.value es undefined significa que se trata de un checkbox

    // Si el event.value está definido chequeo lo siguiente:
      // Si se trata del filtro rangoDeFechas obtengo el rango de fechas en base a los values posibles del combo (ej: HOY, SEMANA, MES etc.).
      // Si no se trata del filtro rangoDeFechas obtengo el value de la opción del filtro seleccionada.
    let value = (typeof event.value === 'undefined') ? (event.checked ? true : false) : (htmlElementId === 'rangoDeFechas' ? this.dateFilterValues[event.value] : event.value);


    // Si el event.source.selected es undefined significa que se trata de un checkbox

    // Si el event.value está definido obtengo el normal viewValue de la opción del filtro seleccionada.
    let viewValue = (typeof event.source.selected === 'undefined') ? (value ? "SI" : "NO") : event.source.selected.viewValue;

    // Muestro u oculto los inputs de rango de fechas personalizadas según el value seleccionado por el usuario.
    if (htmlElementId === 'rangoDeFechas') {
      if (value === 'PERSONALIZADA') {
        this.mostrarFiltroFechaPersonalizada = true;
      } else {
        this.mostrarFiltroFechaPersonalizada = false;
        this.range.controls.fechaDesde.reset();
        this.range.controls.fechaHasta.reset();
      }
    }

    // Sobrescribo las opciones default de los filtros.
    this.filtrosSeleccionados.set(htmlElementId, value);

    // Chequeo si el array de filtros aplicados ya tiene este filtro aplicado con otra opción.
    let index = this.filtrosAplicadosTemporal.findIndex((element) => element['id'] == htmlElementId);

    let filtroAplicado = {
      "id": htmlElementId,
      "label": event.source.ariaLabel,
      "viewValue": viewValue
    }

    // Si ya existe un filtro aplicado con otra opción, lo sobrescribo sino lo agrego.
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

  // Funcion helper para obtener una fecha partiendo del día de hoy y restandole los días indicados como parámetro.
  private getDateByDaysAgo(days: number): string {
    const now = new Date();
    return this.formatDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
  }


  // Funcion para chequear que el rango de fechas del filtro fecha seteado en PERSONALIZADA sea válido.
  private validDatePickerRangeValues(): boolean {
    return (
      this.range.controls.fechaDesde.valid &&
      this.range.controls.fechaHasta.valid &&
      this.range.controls.fechaDesde.value != null &&
      this.range.controls.fechaHasta.value != null
    );
  }

  // Funcion helper para agregarle un 0 si los días o meses tienen 1 dígito.
  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  

  // Funcion helper para formatear la fecha en formato dd/mm/yyyy
  private formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }
}
