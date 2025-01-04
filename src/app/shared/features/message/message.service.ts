import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Error, HttpErrorDto } from '@models/Api';
import { ErrorMessageComponent } from '@shared/features/message/error-message.component';
import { SuccessMessageComponent } from '@shared/features/message/success-message.component';

@Injectable()
export class MessageService {
    constructor(private readonly snackBar: MatSnackBar) {
    }

    success(message: string): void {
        this.showMessage( SuccessMessageComponent, message, 'success-snack-bar' );
    }

    error(error: HttpErrorDto | Error): void {
        this.showMessage( ErrorMessageComponent, error, 'error-snack-bar' );
    }

    private showMessage(component: ComponentType<any>, data: HttpErrorDto | Error | string, type: 'success-snack-bar' | 'error-snack-bar'): void {

        this.snackBar.openFromComponent( component, {
                                             data,
                                             politeness        : 'off',
                                             duration          : 5000,
                                             panelClass        : type,
                                             horizontalPosition: 'left',
                                             verticalPosition  : 'bottom'
                                         }
        );
    }
}
