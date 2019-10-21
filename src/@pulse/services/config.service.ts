import { Injectable, InjectionToken, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { merge, cloneDeep, isEqual } from 'lodash';

export const PULSE_CONFIG = new InjectionToken('pulseCustomConfig');

@Injectable({ providedIn: 'root' })

export class PulseConfigService {
  private readonly _defaultConfig: any;
  private _configSubject: BehaviorSubject<any>;

  constructor(@Inject(PULSE_CONFIG) private _config) {
    this._defaultConfig = _config;

    // Initialize the service
    this._init();
  }

  // Accessors
  get config(): any | Observable<any> {
    return this._configSubject.asObservable();
  }

  private _init(): void {
    this._configSubject = new BehaviorSubject(cloneDeep(this._defaultConfig));
  }
}
