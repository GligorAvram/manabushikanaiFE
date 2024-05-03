import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, ParagraphDto, SentenceDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { ContainerComponent } from '@shared/ui/container.component';
import { SliderComponent } from "@shared/ui/slider.component";
import { WordEditorComponent } from "@writer/ui/word-editor.component";
import { ParagraphEditorComponent } from '@writer/ui/sentence-editor.component';
import { ModalService } from '@shared/features/modal/modal.service';
import { of } from 'rxjs';
import { CreateDictionaryWordFormModalComponent } from './add-word-to-dictionary-form-modal.component';
import { AddWordToDictionaryFormModalData } from '@writer/config/writer.interfaces';
import { ModalModule } from '@shared/features/modal/modal.module';

@Component({
    selector: "app-sentence-editor-manager",
    standalone: true,
    template: `
        <app-slider [rightOption]="sentenceView" [leftOption]="wordView" (onChange)="setSelected($event)"></app-slider>
        <ng-container *ngIf="selected == sentenceView">
            <app-paragraph-editor [paragraphs]="paragraphs" (onTranslationSubmitted)="submitTranslation($event)"></app-paragraph-editor>
        </ng-container>
        <ng-container *ngIf="selected == wordView">
            <app-word-editor
                [possibleTranslations]="possibleTranslations"
                [paragraphs]="paragraphs"
                (onOnWordFieldFilled)="getTranslationForSelectedWord($event)"
                (onTranslationSubmitted)="submitWordsTranslation($event)"
                (onTranslationForWordSelected)="onTranslationForWordSelected.emit()"
                (onAddWordToDictionaryClicked)="openAddWordToDictionaryFormModal()"
            ></app-word-editor>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ContainerComponent, SliderComponent, WordEditorComponent, ParagraphEditorComponent, ModalModule],
})
@UntilDestroy()
export class SentenceEditorComponentManager {
    @Input()
    paragraphs!: ParagraphDto[];

    @Input()
    possibleTranslations!: DictionaryWordDto[];

    @Output()
    onTranslationSubmitted: EventEmitter<CreateParagraphTranslationDto> = new EventEmitter();

    @Output()
    onWordTranslationSubmitted: EventEmitter<CreateWordTranslationForParagraphDto> = new EventEmitter();

    @Output()
    onWordTranslationRequested: EventEmitter<string> = new EventEmitter();

    @Output()
    onTranslationForWordSelected: EventEmitter<void> = new EventEmitter();

    @Output()
    dictionaryWordSubmitted: EventEmitter<CreateDictionaryWordDto> = new EventEmitter();

    sentenceView = "Paragraph view";
    wordView = "Word view";
    selected: string | undefined = this.wordView;

    constructor(public readonly modalService: ModalService) {}

    setSelected(value: string | undefined) {
        this.selected = value;
    }

    submitTranslation(paragraphTranslation: CreateParagraphTranslationDto) {
        this.onTranslationSubmitted.emit(paragraphTranslation);
    }

    submitWordsTranslation(wordTranslation: CreateWordTranslationForParagraphDto) {
        this.onWordTranslationSubmitted.emit(wordTranslation);
    }

    submitDictionaryWord(word: CreateDictionaryWordDto) {
        this.dictionaryWordSubmitted.emit(word);
        this.onWordAddedToDictionarySuccessfully();
    }
    onWordAddedToDictionarySuccessfully() {
        this.closeAddWordToDictionaryFormModal();
    }
    getTranslationForSelectedWord($event: string) {
        this.onWordTranslationRequested.emit($event);
    }

    openAddWordToDictionaryFormModal() {
        this.modalService.openMdModal<AddWordToDictionaryFormModalData>(CreateDictionaryWordFormModalComponent, this, {
            loading$: of(false),
            onSubmit: this.submitDictionaryWord.bind(this),
            onCancel: this.closeAddWordToDictionaryFormModal.bind(this),
        });
    }

    closeAddWordToDictionaryFormModal(): void {
        this.modalService.close(CreateDictionaryWordFormModalComponent);
    }
}
