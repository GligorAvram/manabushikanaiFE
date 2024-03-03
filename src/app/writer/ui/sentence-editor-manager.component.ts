import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SentenceDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { ContainerComponent } from '@shared/ui/container.component';
import { SliderComponent } from "@shared/ui/slider.component";
import { WordEditorComponent } from "@writer/ui/word-editor.component";
import { SentenceEditorComponent } from '@writer/ui/sentence-editor.component';

@Component({
  selector: 'app-sentence-editor-manager',
  standalone: true,
  template: `
    <app-slider
      [rightOption]="sentenceView"
      [leftOption]="wordView"
      (onChange)="setSelected($event)"
    ></app-slider>
    <ng-container *ngIf="selected == sentenceView">
      <app-sentence-editor
        [sentences]="sentences"
        (onTranslationSubmitted)="submitTranslation($event)"
      ></app-sentence-editor>
    </ng-container>
    <ng-container *ngIf="selected == wordView">
      <app-word-editor></app-word-editor>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ContainerComponent,
    SliderComponent,
    WordEditorComponent,
    SentenceEditorComponent,
  ],
})
@UntilDestroy()
export class SentenceEditorComponentManager {
  @Input()
  sentences!: SentenceDto[];

  @Output()
  translationSubmitted = new EventEmitter<SentenceDto>();

  sentenceView = 'Sentence view';
  wordView = 'Word view';
  selected: string | undefined = this.wordView;

  constructor() {}

  setSelected(value: string | undefined) {
    this.selected = value;
  }

  submitTranslation(sentence: SentenceDto) {
    this.translationSubmitted.emit(sentence);
  }
}
