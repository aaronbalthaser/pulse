import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/* Third Party Modules */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Pulse Modules */
import { PulseModule } from '@pulse/pulse.module';

/* App Modules */
import { LayoutModule } from 'app/layout';

/* Components */
import { AppComponent } from './app.component';

/* Services */

/* Config */
import { config } from './config';

/* Application Routes */
const appRoutes = [
  { path: 'apps', loadChildren: './main/apps/apps.module#AppsModule' },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    BrowserModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),

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
