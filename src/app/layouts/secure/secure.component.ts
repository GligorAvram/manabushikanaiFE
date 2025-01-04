import { Component } from '@angular/core';
import { NavigationService } from '@shared/features/navigation/navigation.service';

@Component(
    {
        selector: 'app-secure',
        template: `
            <app-top-bar></app-top-bar>
            <app-side-menu>
                <router-outlet></router-outlet>
            </app-side-menu>
        `
    } )
export class SecureComponent {
    constructor(
        public readonly navigationService: NavigationService
    ) {
    }
}
