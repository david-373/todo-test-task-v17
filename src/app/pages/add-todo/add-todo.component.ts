import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoComponent implements OnDestroy {
  submitted = signal(false);

  #destroy$ = new Subject<void>();
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #todoService = inject(TodoService);

  form: FormGroup = this.#fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    expirationDate: [null, Validators.required],
    expirationTime: [null],
  });

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const { title, expirationDate, expirationTime } = this.form.value;
    const date = new Date(expirationDate); 

    if (expirationTime) {
      const [time, meridian] = expirationTime.split(' ');
      const [rawHours, rawMinutes] = time.split(':').map(Number);
    
      let hours = rawHours;
      if (meridian === 'PM' && rawHours < 12) {
        hours += 12;
      } else if (meridian === 'AM' && rawHours === 12) {
        hours = 0; // midnight
      }
    
      date.setHours(hours);
      date.setMinutes(rawMinutes);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    

    this.#todoService.createTodo({
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      expirationDate: date.toISOString(),
      isFavorite: false,
      isDone: false
    }).pipe(takeUntil(this.#destroy$)).subscribe({
      next: () => {
        this.#router.navigate(['/list']);
      }
    });
  }

  goBack(): void {
    this.#router.navigate(['/list']);
  }
}