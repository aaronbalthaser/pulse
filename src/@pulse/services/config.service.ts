import { Injectable, InjectionToken, Inject } from '@angular/core';

export const PULSE_CONFIG = new InjectionToken('pulseCustomConfig');

@Injectable({ providedIn: 'root' })

export class PulseConfigService {
  private readonly _defaultConfig: any;

  constructor(@Inject(PULSE_CONFIG) private _config) {
    this._defaultConfig = _config;
  }
}
