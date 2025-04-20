import { Component, Input, Output, EventEmitter, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Todo } from '../../../../../models/todo.model';
import { TimerComponent } from '../../../timer/timer.component';

@Component({
  selector: 'app-todo-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    TimerComponent
  ],
  templateUrl: './todo-table.component.html',
  styleUrl: './todo-table.component.scss'
})
export class TodoTableComponent {
  toggleFavorite = output<string>();
  toggleDone = output<string>();
  remove = output<string>();

  data = input<Todo[]>([]);
  isLoading = input<boolean>(false);
  showTimer = input<boolean>(false);
  title = input<string>();

  displayedColumns = ['isDone', 'title', 'createdAt', 'expiration', 'actions'];
}
