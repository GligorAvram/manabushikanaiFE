import { Directive, Input, Output, EventEmitter } from "@angular/core";

@Directive({ selector: '[appButton]' })
export class ButtonDirective {
  @Input()
  disabled: boolean = false;

  @Input()
  fullWidth: boolean = false;

  @Output()
  onClick: EventEmitter<void> = new EventEmitter<void>();
}
