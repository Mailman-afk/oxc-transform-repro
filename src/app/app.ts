import { Component, signal } from '@angular/core';
import { QuillDemo } from './quill-demo/quill-demo';
import { MentionDemo } from './mention-demo/mention-demo';

@Component({
  imports: [QuillDemo, MentionDemo],
  selector: 'app-root',
  styleUrl: './app.css',
  template: `
    @defer (on immediate) {
      <app-quill-demo />
    }
    @defer (on immediate) {
      <app-mention-demo />
    }
  `,
})
export class App {
  protected readonly title = signal('repro');
}
