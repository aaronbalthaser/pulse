import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ContentComponent } from 'app/layout/components/content/container/content.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ContentComponent
  ],
  exports: [
    ContentComponent
  ]
})

export class ContentModule { }
