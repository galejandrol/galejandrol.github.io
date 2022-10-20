import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(public updates: SwUpdate) {
    if (updates.isEnabled) {
      // Chequeo cada 6 horas si existe una versión nueva de la app.
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
        .then(() => console.log('Checking for updates')));
    }
  }

  public checkForUpdates(): void {
    this.updates.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
    })),
    ).subscribe((event) => {
      // Actualizo la app.
      this.updates.activateUpdate().then(() => window.location.reload());
    });
  }
}
