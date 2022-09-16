import { Component, Input, OnInit } from '@angular/core';
import { Filtro } from 'src/app/models/filtro.model';
import { FiltroService } from 'src/app/services/filtro/filtro.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})

export class FiltroComponent implements OnInit {

  @Input() asd: string = '';

  filtrosSeleccionados: Array<{filtro: string, value: string | number}> = [
    {
    filtro: "Cliente",
    value: 0
    }
  ];

  filtros: Array<Filtro> = [];
  RubrosClientes: string = '';

  constructor(private filtroService: FiltroService) { }

  ngOnInit(): void {
    this.filtrosSeleccionados.push({
      filtro: "Metrica",
      value: this.asd
    })
    this.filtroService.obtenerOpcionesDeFiltros()
    .subscribe({
      next: (filtrosOpcionesArray) => {
        this.filtros = filtrosOpcionesArray;
        console.log(this.filtros)
      },
      error: (err) => {
        console.error(`HTTP ERROR - [CODE: ${err.status}], [MESSAGE: ${err.statusText}]`);
      }
    })
  }

  aplicarFiltro(): void {
    console.log("aplicar");
  }

  select(event: any){

    let filtroNames = this.filtrosSeleccionados.map(function(a) {return a.filtro;});

    if (filtroNames.includes(event.source.id)) {
      let index = filtroNames.indexOf(event.source.id);
      this.filtrosSeleccionados[index].value = event.value;
    } else {
      this.filtrosSeleccionados.push({
        filtro: event.source.id,
        value: event.value
      })
    }

    console.log(this.filtrosSeleccionados);
  }
}
