import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PulseSidebarModule } from '@pulse/components';

import { ContentModule } from 'app/layout/components/content/content.module';

import { VerticalLayout1Component } from './layout-1.component';

@NgModule({
  imports: [
    PulseSidebarModule,
    CommonModule,

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
