import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContainerComponent } from '@shared/ui/container.component';

@Component( {
                standalone     : true,
                selector       : 'app-path-image',
                template       : `
                    <div class="mb-3" *ngIf="image">
                        <app-container>
                            <img [src]="image" [height]="height" [width]="width" alt="Story Image"/>
                        </app-container>
                    </div>`,
                imports        : [ ContainerComponent, NgIf ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class PathImage {
    @Input()
    height: number = 50;

    @Input()
    width: number = 75;

    @Input()
    image!: string;
}
