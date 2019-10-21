import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerticalLayout1Module } from './vertical/layout-1';
import { VerticalLayout2Module } from './vertical/layout-2';

@NgModule({
  imports: [
    CommonModule,

    VerticalLayout1Module,
    VerticalLayout2Module
  ],
  declarations: [],
  providers: [],
  exports: [
    VerticalLayout1Module,
    VerticalLayout2Module
  ]
})

export class LayoutModule { }
