import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerticalLayout1Module, VerticalLayout2Module } from './vertical';

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
