import { NgModule, ModuleWithProviders } from '@angular/core';

import { PULSE_CONFIG } from './services/config.service';

@NgModule()

export class PulseModule {
  static forRoot(config): ModuleWithProviders {
    return {
      ngModule: PulseModule,
      providers: [
        {
          provide: PULSE_CONFIG,
          useValue: config
        }
      ]
    }
  }
}
