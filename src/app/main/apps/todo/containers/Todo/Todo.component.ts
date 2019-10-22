import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'todo',
  styleUrls: ['./todo.component.scss'],
  template: `
    <div>Todo</div>
  `
})

export class TodoComponent implements OnInit {


  ngOnInit() {
    console.log('Initializing Todo');
  }
}
