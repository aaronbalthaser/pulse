import { Injectable } from '@angular/core';

import { PulseSidebarComponent } from '../containers';

@Injectable({
  providedIn: 'root'
})

export class PulseSidebarService {

  private _registry: { [key: string]: PulseSidebarComponent } = {};

  /**
   * Add the sidebar to the registry
   *
   * @param key
   * @param sidebar
   */
  register(key, sidebar): void {
    if (this._registry[key]) {
      console.error(`The sidebar with the key '${key}' already exists. Either unregister it first or use a unique key.`);

      return;
    }

    // Add sidebar to registry
    this._registry[key] = sidebar;
  }

  /**
   * Remove the sidebar from the registry
   *
   * @param key
   */
  unregister(key): void {
    if (!this._registry[key]) {
      console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Remove sidebar from registry
    delete this._registry[key];
  }

  getSidebar(key): PulseSidebarComponent {
    if (!this._registry[key]) {
      console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return the sidebar
    return this._registry[key];
  }
}

