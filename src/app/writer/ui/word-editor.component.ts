import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'app-word-editor',
  template: `word editor`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordEditorComponent {}