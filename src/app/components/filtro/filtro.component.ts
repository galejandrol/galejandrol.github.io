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
          value: "TODOS",
          viewValue: "TODOS"
        },
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
          value: "TODAS",
          viewValue: "TODAS"
        },
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
    {
      label: 'Grado Operativo',
      options: [
        {
          value: "TODOS",
          viewValue: "TODAS"
        },
        {
          value: "CODIGO ROJO",
          viewValue: "CODIGO ROJO"
        },
        {
          value: "CODIGO AMARILLO",
          viewValue: "CODIGO AMARILLO"
        },
        {
          value: "VISITA",
          viewValue: "VISITA"
        },
      ]
    }, 
    {
      label: 'Fecha',
      options: [
        {
          value: "HOY",
          viewValue: "HOY"
        },
        {
          value: "UNA SEMANA",
          viewValue: "UNA SEMANA"
        },
        {
          value: "UN MES",
          viewValue: "UN MES"
        },
        {
          value: "PERSONALIZADO",
          viewValue: "PERSONALIZADO"
        },
      ]
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
