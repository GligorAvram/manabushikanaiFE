import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Error, HttpErrorDto } from '@models/Api';

@Component( {
                selector       : 'app-error-message',
                template       : `
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <ng-container>
                            <p style="padding: 0; margin: 0">Error</p>
                        </ng-container>
                        <strong>{{ error.message }}</strong>
                        <ng-container>
                            <ul *ngIf="errors">
                                <li *ngFor="let error of errors | keyvalue">{{ error.key }}:{{ error.value }}</li>
                            </ul>
                        </ng-container>
                    </div>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ErrorMessageComponent implements OnInit {

    errors: Record<string, string> | undefined;

    constructor(@Inject( MAT_SNACK_BAR_DATA ) readonly error: HttpErrorDto | Error) {
    }

    ngOnInit(): void {
        if( 'error' in this.error ) {
            this.errors = this.error.error;
        }
    }
}
