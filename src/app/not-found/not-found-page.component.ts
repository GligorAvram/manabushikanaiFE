import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { PrimaryButtonComponent } from '@shared/ui/buttons/primary-button.component';

@Component({
  selector: 'app-not-found-page',
  template: `
    <app-primary-button
      backButton
      appButton
      label="Back"
      [icon]="icon.Back"
      ></app-primary-button
    >
    <h1>404 NOT FOUND</h1>
  `
})
export class NotFoundPageComponent {
  icon = IconEnum
  constructor(private location: Location) {}
}
