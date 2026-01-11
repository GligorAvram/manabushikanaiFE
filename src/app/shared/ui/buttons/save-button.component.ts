import { Component, Host } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonDirective } from './button.directive';
import { ButtonModule } from './button.module';

@Component( {
                selector : 'app-save-button',
                template : `
                    <button
                        mat-raised-button
                        color="primary"
                        type="submit"
                        [disabled]="btn.disabled"
                        [class.w-100]="btn.fullWidth"
                        (click)="btn.onClick.emit()"
                    >
                        Save
                    </button>
                `,
                styleUrls: [ './button.scss' ],
                imports  : [ MatButtonModule, ButtonModule ]
            } )
export class SaveButtonComponent {
    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
