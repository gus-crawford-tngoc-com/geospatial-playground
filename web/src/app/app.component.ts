import { ApplicationRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    protected readonly app: ApplicationRef
  ) { }
  title = window.localStorage.getItem("candidate") || 'assessment';
  answerRecorded(key:string) {
    return !!window.localStorage.getItem(key);
  }
  done() {
    window.localStorage.setItem("done", (new Date()).toString())
    this.app.tick();
  }
}
