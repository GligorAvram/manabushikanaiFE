import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SentenceDto } from "app/models/Api";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { ButtonDirective } from "@shared/ui/buttons/button.directive";
import { IconEnum } from "@shared/config/enums/icon.enum";

@Component({
  selector: 'app-word-editor',
  template: `
    <div>
      <app-primary-button
        label="Add word to dictionary"
        [icon]="icon.Add"
        appButton
        (click)="openAddWordWordToDictionaryModal()"
      ></app-primary-button>
    </div>
    word editor`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrimaryButtonComponent, ButtonModule],
})
export class WordEditorComponent {
  @Input()
  sentences!: SentenceDto[];

  @Output()
  onTranslationSubmitted: EventEmitter<null> = new EventEmitter();

  @Output()
  onDictionaryWordSubmitted: EventEmitter<null> = new EventEmitter();

  @Output()
  onAddWordToDictionaryClicked: EventEmitter<null> = new EventEmitter();

  icon = IconEnum;

  openAddWordWordToDictionaryModal() {
    console.log('asdsa');
    this.onAddWordToDictionaryClicked.emit(null);
  }
}