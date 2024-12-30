import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {ContainerComponent} from "@shared/ui/container.component";
import {NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-byte-array-image',
  template: `
    <div class="mb-3" *ngIf="image">
      <app-container>
        <img [src]="imageSrc" [height]="height" [width]="width" alt="Dynamic Image"/>
      </app-container>
    </div>`,
  imports: [ContainerComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByteArrayImage implements OnInit {
  imageSrc: string | undefined;

  @Input()
  height: number = 50;

  @Input()
  width: number = 75;

  @Input()
  image!: string[]

  ngOnInit() {
    this.imageSrc = `data:image/png;base64,${this.image}`;
  }
}
