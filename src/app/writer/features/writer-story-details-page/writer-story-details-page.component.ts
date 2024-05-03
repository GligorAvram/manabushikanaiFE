import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WriterStoryDetailsDataService } from "./writer-story-details-data.service";
import { NavigationService } from "@shared/features/navigation/navigation.service";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, SentenceDto } from 'app/models/Api';

@Component({
    selector: "",
    template: `
        <ng-container *ngIf="(dataService.data$ | async)! as data">
            <app-loading-bar [visible]="data.loading"></app-loading-bar>
            <app-sentence-editor-manager
                [possibleTranslations]="data.possibleWordTranslations"
                (onTranslationSubmitted)="submitTranslation($event)"
                (onWordTranslationSubmitted)="submitWordsTranslation($event)"
                (onTranslationForWordSelected)="onTranslationForWord()"
                *ngIf="data.story"
                [paragraphs]="data.story!.paragraphs ?? []"
                (dictionaryWordSubmitted)="submitDictionaryWord($event)"
                (onWordTranslationRequested)="getTranslationForWord($event)"
            >
            </app-sentence-editor-manager>
        </ng-container>
    `,
    providers: [WriterStoryDetailsDataService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WriterStoryDetailsPageComponent implements OnInit {
    constructor(
        public readonly dataService: WriterStoryDetailsDataService,
        public readonly navigationService: NavigationService,
    ) {}

    ngOnInit(): void {
        this.dataService.init(this);
    }

    submitTranslation(paragraph: CreateParagraphTranslationDto) {
        this.dataService.submitSentenceTranslationForParagraph(paragraph);
    }

    submitWordsTranslation(wordsTranslationForParagraph: CreateWordTranslationForParagraphDto){
        this.dataService.submitWordsTranslationForParagraph(wordsTranslationForParagraph);
    }

    submitDictionaryWord(word: CreateDictionaryWordDto) {
        this.dataService.submitWordToDictionary(word);
    }

    getTranslationForWord(word: string) {
        this.dataService.getTranslationForWord(word);
    }

    onTranslationForWord() {
        this.dataService.clearPossibleDictionaryWordList();
    }
}