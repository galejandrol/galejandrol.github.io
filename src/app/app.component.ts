import { Component } from '@angular/core';
import { UpdateService } from './services/update/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shaman-Metrics-PWA';

  constructor(private sw: UpdateService) {
    // Uso el servicio del SW para chequear nuevas versiones de la app.
    this.sw.checkForUpdates();
  }
}
