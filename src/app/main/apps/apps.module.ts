import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  { path: 'todo', loadChildren: './todo/todo.module#TodoModule' },
  { path: '**', redirectTo: 'todo' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})

export class AppsModule { }
