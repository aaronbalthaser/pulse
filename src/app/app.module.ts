import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* Third Party Modules */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Pulse Modules */
import { PulseModule } from '@pulse/pulse.module';

/* App Modules */
import { LayoutModule } from 'app/modules';

/* Components */
import { AppComponent } from './app.component';

/* Services */

/* Config */
import { config } from './config';

@NgModule({
  imports: [
    BrowserModule,
    FontAwesomeModule,

    PulseModule.forRoot(config),

    LayoutModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
