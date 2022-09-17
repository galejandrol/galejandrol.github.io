import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filtro } from 'src/app/models/filtro.model';
import { FiltroService } from 'src/app/services/filtro/filtro.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})

export class FiltroComponent implements OnInit {

  mostrasrFiltroFechaPersonalizada: boolean = false;

  range = new FormGroup({
    fechaDesde: new FormControl<Date | null>(null),
    fechaHasta: new FormControl<Date | null>(null),
  });

  @Input() metricId: string = '';
  private dateFilter: Filtro = {
    label: "Fecha",
    name: "Fecha",
    filterOptions: [
      {
        id: `${this.getDateByDaysAgo(0)}-${new Date().toLocaleDateString()}`,
        descripcion: "HOY"
      },
      {
        id: `${this.getDateByDaysAgo(7)}-${new Date().toLocaleDateString()}`,
        descripcion: "UNA SEMANA"
      },
      {
        id: `${this.getDateByDaysAgo(30)}-${new Date().toLocaleDateString()}`,
        descripcion: "UN MES (30 DIAS)"
      },
      {
        id: 'PERSONALIZADA',
        descripcion: "PERSONALIZADA"
      },
    ]
  }

  filtrosSeleccionados: Array<{filtro: string, value: string | number | boolean}> = [
    {
      filtro: "clienteId",
      value: 0
    },
    {
      filtro: "includeAnulados",
      value: true
    },
    {
      filtro: "includeNoAtendidos",
      value: true
    }
  ];

  filtros: Array<Filtro> = [];

  constructor(private filtroService: FiltroService) { }

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

    this.filtrosSeleccionados.push({
      filtro: "metricId",
      value: this.metricId
    })
  }

  aplicarFiltro(): void {
    console.log(this.filtrosSeleccionados);
  }

  select(event: any){
    if (event.value === 'PERSONALIZADA') {
      this.mostrasrFiltroFechaPersonalizada = true;
    } else {
      this.mostrasrFiltroFechaPersonalizada = false;
      this.range.controls.fechaDesde.reset();
      this.range.controls.fechaHasta.reset();
      let filtroNames = this.filtrosSeleccionados.map(function(a) {return a.filtro;});

      if (filtroNames.includes(event.source.id)) {
        let index = filtroNames.indexOf(event.source.id);
        this.filtrosSeleccionados[index].value = event.value || event.checked;
      } else {
        this.filtrosSeleccionados.push({
          filtro: event.source.id,
          value: event.value || event.checked
        })
      }
    }
    console.log(this.filtrosSeleccionados);
  }

  getDateByDaysAgo(days: number): string {
    const now = new Date();
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toLocaleDateString();
  }
}
