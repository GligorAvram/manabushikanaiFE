import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';

@Component( {
                standalone     : true,
                selector       : 'app-radio-group',
                template       :
                    `
                        <mat-radio-group
                            aria-labelledby="example-radio-group-label"
                            class="example-radio-group"
                            (change)="changeSelection($event)"
                            [(ngModel)]="default">
                            @for (option of options; track option) {
                                <mat-radio-button class="example-radio-button" [value]="option">{{ option }}</mat-radio-button>
                            }
                        </mat-radio-group>
                    `,
                imports        : [
                    MatRadioButton,
                    MatRadioGroup,
                    FormsModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class RadioGroupComponent implements OnInit {
    @Input()
    visible: boolean = true;

    @Output()
    onSelectionChange: EventEmitter<string> = new EventEmitter();

    @Input() options!: string[];
    @Input() default!: string;

    ngOnInit(): void {
        this.default = this.options[0];
    }

    changeSelection($event: MatRadioChange): void {
        this.onSelectionChange.emit( $event.value );
    }
}
