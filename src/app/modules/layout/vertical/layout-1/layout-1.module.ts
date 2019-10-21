import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerticalLayout1Component } from './layout-1.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    VerticalLayout1Component
  ],
  exports: [

    VerticalLayout1Component
  ]
})

export class VerticalLayout1Module { }
