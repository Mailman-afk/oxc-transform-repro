import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import Quill from 'quill';
@Component({
  imports: [],
  selector: 'app-quill-demo',
  styles: ``,
  template: `<div #editor></div>`,
})
export class QuillDemo implements AfterViewInit {
  editor = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  ngAfterViewInit() {
    new Quill(this.editor().nativeElement, { theme: 'snow' });
  }
}
