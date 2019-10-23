import { NgModule } from '@angular/core';

import { PulseSidebarComponent } from './containers';

import { PulseSidebarService } from './services';

@NgModule({
  declarations: [
    PulseSidebarComponent
  ],
  exports: [
    PulseSidebarComponent
  ],
  providers: [
    PulseSidebarService
  ]
})

export class PulseSidebarModule { }
