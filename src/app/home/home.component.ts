import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileQuery: MediaQueryList;

  fillerNav = ['Inicio', 'Modulos'];

  user: { [key: string]: any};
  modulosList: [];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    
    if (!localStorage.getItem('user')){
      this.router.navigateByUrl('/login');
    }

    this.user = JSON.parse(localStorage.getItem('user')!);
    this.modulosList = [];

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }











  ngOnInit(): void {
    this.getModulos();
  }

  public async getModulos(){
    const alias = JSON.parse(localStorage.getItem('licencia')!)['alias'];
    const response = await fetch(`https://localhost:6001/api/v1/Licenses/Alias/${alias}/modulos`);

    if (response.ok){
      this.modulosList = await response.json();
    }
  }

  public logout(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }

}
