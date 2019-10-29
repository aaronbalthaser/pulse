import { NgModule } from '@angular/core';

import { PulsePanelComponent } from './containers';

import { PulsePanelService } from './services';

@NgModule({
  declarations: [
    PulsePanelComponent
  ],
  exports: [
    PulsePanelComponent
  ],
  providers: [
    PulsePanelService
  ]
})

export class PulsePanelModule { }
