import { Component, Host } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ButtonDirective } from "./button.directive";
import { ButtonModule } from "./button.module";

@Component({
  standalone: true,
  selector: 'app-cancel-button',
  template: `
    <button
      mat-button
      [disabled]="btn.disabled"
      [class.w-100]="btn.fullWidth"
      (click)="btn.onClick.emit()"
    >
      Cancel
    </button>
  `,
  styleUrls: ['./button.scss'],
  imports: [MatButtonModule, ButtonModule],
})
export class CancelButtonComponent {
  constructor(@Host() public readonly btn: ButtonDirective) {}
}
