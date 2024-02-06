import { Component } from "@angular/core";

@Component({
  selector: 'app-public',
  template: `
    <app-top-bar></app-top-bar>
    <app-side-menu>
        <router-outlet></router-outlet>
    </app-side-menu>
  `,
})
export class PublicComponent {}
