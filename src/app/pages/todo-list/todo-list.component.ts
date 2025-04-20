import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TodoTableComponent } from '../../shared/components/shared/components/todo-table/todo-table.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoTableComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  displayedColumns = ['isDone', 'title', 'createdAt', 'expiration', 'actions'];
  isLoading = signal<boolean>(false);

  #refresh$ = new BehaviorSubject<void>(undefined);
  #destroy$ = new Subject<void>();

  #todoService = inject(TodoService);
  #route = inject(ActivatedRoute);

  #isFavoriteView = this.#route.snapshot.data['showOnlyFavorites'] ?? false;

  todayTodos$: Observable<Todo[]> = this.#refresh$.pipe(
    switchMap(() => this.#todoService.getTodos()),
    map((todos) => this.#filterTodos(todos, true))
  );

  otherTodos$: Observable<Todo[]> = this.#refresh$.pipe(
    switchMap(() => this.#todoService.getTodos()),
    map((todos) => this.#filterTodos(todos, false))
  );

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  onRemove(id: string) {
    this.isLoading.set(true);
    this.#todoService
      .deleteTodo(id)
      .pipe(takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          this.#refresh$.next();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  onToggleDone(id: string) {
    this.isLoading.set(true);
    this.#todoService
      .toggleDone(id)
      .pipe(takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          this.#refresh$.next();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  onToggleFavorite(id: string) {
    this.isLoading.set(true);
    this.#todoService
      .toggleFavorite(id)
      .pipe(takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          this.#refresh$.next();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  #filterTodos(todos: Todo[], isToday: boolean): Todo[] {
    const today = new Date().toISOString().split('T')[0];

    return todos.filter((t) => {
      const matchDate = isToday
        ? t.expirationDate.startsWith(today)
        : !t.expirationDate.startsWith(today);
      const matchFavorite = this.#isFavoriteView ? t.isFavorite : true;
      return matchDate && matchFavorite;
    });
  }
}
