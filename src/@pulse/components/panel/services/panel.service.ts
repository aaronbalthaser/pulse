import { Injectable } from '@angular/core';

import { PulsePanelComponent } from '../containers';

@Injectable({
  providedIn: 'root'
})

export class PulsePanelService {

  private _registry: { [key: string]: PulsePanelComponent } = {};

  /**
   * Add the panel to the registry
   *
   * @param key
   * @param panel
   */
  public register(key, panel): void {
    if (this._registry[key]) {
      console.error(`The panel with the key '${key}' already exists. Either unregister it first or use a unique key.`);

      return;
    }

    // Add panel to registry
    this._registry[key] = panel;
  }

  /**
   * Remove the panel from the registry
   *
   * @param key
   */
  public unregister(key): void {
    if (!this._registry[key]) {
      console.warn(`The panel with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Remove panel from registry
    delete this._registry[key];
  }

  public getPanel(key): PulsePanelComponent {
    if (!this._registry[key]) {
      console.warn(`The panel with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return the panel
    return this._registry[key];
  }
}
