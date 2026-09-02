import { Component } from '@angular/core';
import Quill from 'quill';
import 'quill-mention';

@Component({
  imports: [],
  selector: 'app-mention-demo',
  styles: ``,
  template: `<p>{{ hasMention }}</p>`,
})
export class MentionDemo {
  hasMention = !!Quill.import('modules/mention');
}
