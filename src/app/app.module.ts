import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* Third Party Modules */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Modules */
import { PulseModule } from '@pulse/pulse.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,

    FontAwesomeModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }