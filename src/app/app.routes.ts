import { Routes } from '@angular/router';
import { AddTodoComponent } from './pages/add-todo/add-todo.component';
import { TodoListComponent } from './pages/todo-list/todo-list.component';

export const routes: Routes = [
  { path: 'add', component: AddTodoComponent },
  { path: 'list', component: TodoListComponent },
  { path: 'favorite', component: TodoListComponent, data: {showOnlyFavorites: true} },
  { path: '**', redirectTo: 'list' },
];
