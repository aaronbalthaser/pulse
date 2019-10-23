import { NgModule } from '@angular/core';

import { PulseSidebarModule } from '@pulse/components';

import { ContentModule } from 'app/layout/components/content/content.module';

import { VerticalLayout1Component } from './layout-1.component';

@NgModule({
  imports: [
    PulseSidebarModule,

    ContentModule
  ],
  declarations: [
    VerticalLayout1Component
  ],
  exports: [
    VerticalLayout1Component
  ]
})

export class VerticalLayout1Module { }
