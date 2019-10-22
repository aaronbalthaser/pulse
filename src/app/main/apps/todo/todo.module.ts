import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { TodoComponent } from './containers';

/* Routes */
const routes = [
  { path: 'all', component: TodoComponent },
  { path: '**', redirectTo: 'all' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [
    TodoComponent
  ],
  providers: []
})

export class TodoModule { }
