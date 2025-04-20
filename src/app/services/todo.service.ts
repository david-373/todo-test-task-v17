import { inject, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, of, tap } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private _cache: Todo[] | null = null;

  #storageMap = inject(StorageMap);

  constructor() {}

  createTodo(todo: Todo): Observable<Todo[]> {
    return this.getTodos().pipe(
      switchMap((todos: Todo[]) => {
        const newList = [todo, ...todos];
        return this.#storageMap
          .set(this.STORAGE_KEY, newList)
          .pipe(map(() => newList)) as Observable<Todo[]>;
      }),
      delay(400),
      tap((newList: Todo[]) => {
        this._cache = newList;
      })
    );
  }

  deleteTodo(id: string) {
    return this.getTodos().pipe(
      switchMap((todos: Todo[]) => {
        const newList = todos.filter((todo) => todo.id !== id);
        return this.#storageMap
          .set(this.STORAGE_KEY, newList)
          .pipe(map(() => newList)) as Observable<Todo[]>;
      }),
      delay(300),
      tap((newList: Todo[]) => {
        this._cache = newList;
      })
    );
  }

  getTodos(): Observable<Todo[]> {
    if (this._cache) {
      return of(this._cache).pipe(delay(400));
    }

    return this.#storageMap.get(this.STORAGE_KEY).pipe(
      map((data) => (data ?? []) as Todo[]),
      delay(400),
      tap((data: Todo[]) => (this._cache = data))
    );
  }

  toggleDone(id: string): Observable<Todo[]> {
    return this.getTodos().pipe(
      switchMap((todos: Todo[]) => {
        const todoToChange = todos.find((todo) => todo.id === id);
        if(todoToChange){
          todoToChange.isDone = !todoToChange.isDone; 
        }
        return this.#storageMap
          .set(this.STORAGE_KEY, todos)
          .pipe(map(() => todos)) as Observable<Todo[]>;
      }),
      delay(300),
      tap((newList: Todo[]) => {
        this._cache = newList;
      })
    );
  }

  toggleFavorite(id: string): Observable<Todo[]> {
    return this.getTodos().pipe(
      switchMap((todos: Todo[]) => {
        const todoToChange = todos.find((todo) => todo.id === id);
        if(todoToChange){
          todoToChange.isFavorite = !todoToChange.isFavorite; 
        }
        return this.#storageMap
          .set(this.STORAGE_KEY, todos)
          .pipe(map(() => todos)) as Observable<Todo[]>;
      }),
      delay(300),
      tap((newList: Todo[]) => {
        this._cache = newList;
      })
    );
  }
}
