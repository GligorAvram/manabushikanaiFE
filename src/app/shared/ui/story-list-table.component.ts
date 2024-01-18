import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading-spinner.component";

@Component({
    selector: 'app-story-list-table',
    template: ` 
    <app-loading-spinner [visible]="true"></app-loading-spinner>
     `,
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LoadingSpinnerComponent]
})
export class StoryListTableComponent {}
