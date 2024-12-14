import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {ParagraphDto} from "app/models/Api";
import {ButtonModule} from "@shared/ui/buttons/button.module";
import {IconEnum} from "@shared/config/enums/icon.enum";

@Component({
  selector: 'app-word-editor',
  template: ` <div>

    </div>
    word editor`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
})
export class WordEditorComponent {
  @Input()
  paragraph!: ParagraphDto;

  icon = IconEnum;
}
