import { Component, OnInit } from '@angular/core';

interface FiltroOptions {
  value: string;
  viewValue: string;
}

interface Filtros{
  label: string;
  options: Array<FiltroOptions>;
}

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {

  filtros: Filtros[] = [
    {
      label: 'Clientes',
      options: [
        {
          value: "OSDE",
          viewValue: "OSDE"
        },
        {
          value: "SWISS MEDICAL",
          viewValue: "SWISS MEDICAL"
        },
      ]
    },
    {
      label: 'Zonas',
      options: [
        {
          value: "CABA",
          viewValue: "CABA"
        },
        {
          value: "GBA NORTE",
          viewValue: "GBA NORTE"
        },
      ]
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  mostrarListaDeModulos(){
    let modulosListDiv = document.getElementById('modulosList') as HTMLDivElement;
    let moduloDetalleDiv = document.getElementById('moduloDetalle') as HTMLDivElement;
    moduloDetalleDiv.style.display = 'none';
    modulosListDiv.style.display = 'block';
  }
}
