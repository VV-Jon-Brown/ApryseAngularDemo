import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-doc-list',
  template: `
  <div (click)="onSelect()">
    <p>
      doc-list works!
    </p>
    {{documentPath}}
  </div>
  `,
  styles: [
  ]
})
export class DocListComponent {
  @Input()
  documentPath = '';
  @Output()
  public documentSelected: EventEmitter<void> = new EventEmitter();

  public onSelect() {
    console.log('HI')
    this.documentSelected.emit();
  }
}
