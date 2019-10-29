import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PulsePanelModule } from '@pulse/components';

import { ContentModule } from 'app/layout/components';
import { NavbarModule } from 'app/layout/components';
import { ToolbarModule } from 'app/layout/components';

import { VerticalLayout1Component } from './layout-1.component';

@NgModule({
  imports: [
    PulsePanelModule,
    CommonModule,

    ContentModule,
    NavbarModule,
    ToolbarModule
  ],
  declarations: [
    VerticalLayout1Component
  ],
  exports: [
    VerticalLayout1Component
  ]
})

export class VerticalLayout1Module { }
