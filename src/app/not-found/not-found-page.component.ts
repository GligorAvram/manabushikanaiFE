import { Component } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';

@Component( {
                selector  : 'app-not-found-page',
                standalone: false,
                template  : `
                    <app-primary-button
                        backButton
                        appButton
                        label="Back"
                        [icon]="icon.Back"
                    ></app-primary-button
                    >
                    <h1>404 NOT FOUND</h1>
                `
            } )
export class NotFoundPageComponent {
    icon = IconEnum;
}
