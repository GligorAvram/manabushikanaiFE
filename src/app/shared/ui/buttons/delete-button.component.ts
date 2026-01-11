import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonDirective } from './button.directive';
import { ButtonModule } from './button.module';
import { MatIconModule } from '@angular/material/icon';

@Component( {
                selector : 'app-delete-button',
                template : `
                    <button
                        matMiniFab
                        color="warn"
                        aria-label="Delete"
                        class="custom-mini-fab"
                        [disabled]="btn.disabled"
                        (click)="btn.onClick.emit()"
                    >
                        <mat-icon class="custom-mini-icon">delete</mat-icon>
                    </button>
                `,
                styleUrls: [ './button.scss' ],
                imports  : [ MatButtonModule, ButtonModule, MatIconModule ]
            } )
export class DeleteButtonComponent {

    constructor(@Host() public readonly btn: ButtonDirective) {
    }

    @Input()
    label = 'Delete';
}
