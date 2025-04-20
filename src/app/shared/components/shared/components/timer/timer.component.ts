import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class.critical]="isCritical()">
      {{ timeLeft() }}
    </span>
  `,
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent {  
  timeLeft = signal('');
  isCritical = signal(false);
  
  #targetDate = signal<Date>(new Date());

  endDate = input('', {
    transform: (value: string) => {
      if (!value) return;
      const date = new Date(value);
      if (isNaN(date.getTime())) return;
      this.#targetDate.set(date);
      this.#startCountdown();
      return value;
    },
  });

  #startCountdown() {
    const update = () => {
      const now = new Date();
      const diff = this.#targetDate().getTime() - now.getTime();

      if (diff <= 0) {
        this.timeLeft.set('Expired');
        this.isCritical.set(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      this.timeLeft.set(`${hours}h ${minutes}m ${seconds}s`);
      this.isCritical.set(diff < 3600000); 

      requestAnimationFrame(update);
    };

    update();
  }
}
