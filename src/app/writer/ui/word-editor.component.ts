import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from "@angular/cdk/drag-drop";
import { CreateWordTranslationForParagraphDto, DictionaryWordDto, ParagraphDto, WordTranslationDto } from "app/models/Api";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { IconEnum } from "@shared/config/enums/icon.enum";
import { ContainerComponent } from "@shared/ui/container.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { SelectInputComponent } from "../../shared/ui/input/select-input.component";
import { WriterPipesModule } from "@writer/pipes/writer-pipes.module";
import { InputModule } from "@shared/ui/input/input.module";
import { TextInputComponent } from "@shared/ui/input/text-input.component";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { valueIsNotEmpty } from "@shared/functions";


export type wordTranslationData = {
    formGroup: FormGroup;
    paragraph: ParagraphDto & { words: WordTranslationDto[] };
};

@Component({
    selector: "app-word-editor",
    template: `<app-container>
            <app-primary-button label="Add word to dictionary" [icon]="icon.Add" appButton (onClick)="openAddWordWordToDictionaryModal()"></app-primary-button>
        </app-container>
        <app-container>
            <mat-card>
                <mat-stepper [linear]="false" #stepper *ngIf="formGroups" (selectionChange)="onStepChange($event)">
                    <mat-step *ngFor="let group of formGroups; let index = index" [completed]="group.paragraph.wordsDone" [stepControl]="group.formGroup">
                        <form [formGroup]="group.formGroup" *ngIf="group.paragraph.originalParagraph">
                            <ng-template matStepLabel></ng-template>
                            <div [innerHTML]="selectedParagraph"></div>
                            <app-text-input class="displayBlock" appInput #word placeholder="Word in Kanji" formControlName="wordKanji" />
                            <app-text-input class="displayBlock" appInput #word placeholder="Word in Kana" formControlName="wordKana" />
                            <app-text-input class="displayBlock" appInput #dictWord formControlName="dictionaryWord" (input)="handleGetWordTranslation($event)" />
                            <app-select-input class="displayBlock" appInput formControlName="translation" [options]="possibleTranslations | possibleTranslationToInputOptions" />
                            <ng-container>
                                <mat-label class="displayBlock">Translated paragraph</mat-label>
                                <div cdkDropList (cdkDropListDropped)="drop($event, index)">
                                    @for (word of words; track word) {
                                    <div cdkDrag>{{ word.wordKanji }}</div>
                                    }
                                </div>
                            </ng-container>
                            <ng-container>
                                <div class="topMargin">
                                    <app-primary-button appButton [icon]="icon.Add" label="Add word translation" (onClick)="addWordTranslation(group.formGroup, index)" />
                                    <app-primary-button appButton [icon]="icon.Add" label="Submit translation" (onClick)="submitTranslation(index)"></app-primary-button>
                                    <app-primary-button appButton label="Next" matStepperNext />
                                </div>
                            </ng-container>
                        </form>
                    </mat-step>
                    <mat-step>
                        <ng-template matStepLabel>Done</ng-template>
                        <p>You are now done.</p>
                        <div>
                            <app-primary-button appButton label="Back" />
                        </div>
                    </mat-step>
                </mat-stepper>
            </mat-card>
        </app-container> `,
    standalone: true,
    styles: `
            .displayBlock {
                display: block;
                width: 100%;
            }

            .flex {
                display: flex;
            }

            .topMargin {
                margin-top: 2rem;
            }

            ::ng-deep .grey-out {
                color: #999;
                user-select: none;
            }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PrimaryButtonComponent, ButtonModule, ContainerComponent, MatCardModule, MatStepperModule, FormsModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, WriterPipesModule, SelectInputComponent, TextInputComponent, InputModule, CdkDropList, CdkDrag],
})
@UntilDestroy()
export class WordEditorComponent implements OnInit {
    @Input()
    possibleTranslations!: DictionaryWordDto[];

    @Input()
    paragraphs!: ParagraphDto[];

    @Output()
    onAddWordToDictionaryClicked: EventEmitter<null> = new EventEmitter();

    @Output()
    onOnWordFieldFilled: EventEmitter<string> = new EventEmitter();

    @Output()
    onTranslationSubmitted: EventEmitter<CreateWordTranslationForParagraphDto> = new EventEmitter();

    @Output()
    onTranslationForWordSelected: EventEmitter<void> = new EventEmitter();

    icon = IconEnum;
    selectedParagraph!: String;
    words: WordTranslationDto[] = [];
    formGroups!: wordTranslationData[];
    doneWordCssClass = "grey-out";

    constructor(private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.formGroups = this.generateGroups();
        this.onStepChange({ selectedIndex: 0 } as StepperSelectionEvent);
    }

    openAddWordWordToDictionaryModal() {
        this.onAddWordToDictionaryClicked.emit(null);
    }

    onStepChange($event: StepperSelectionEvent) {
        this.selectedParagraph = this.paragraphs[$event.selectedIndex].originalParagraph!;
    }

    drop(event: CdkDragDrop<WordTranslationDto>, index: number) {
        console.log(event)
        if (valueIsNotEmpty(this.words)) {
            moveItemInArray(this.words, event.previousIndex, event.currentIndex);
            this.generateHtmlForSentence(this.paragraphs[index].originalParagraph!);
        }
    }

    submitTranslation(index: number) {
        this.words.forEach((word, index) => (word.order = index));
        this.onTranslationSubmitted.emit({ paragraphId: this.paragraphs[index].id!, words: this.words });
    }

    addWordTranslation(group: FormGroup, index: number) {
        this.words.push({ wordKanji: group.controls["wordKanji"].getRawValue(), wordKana: group.controls["wordKana"].getRawValue(), dictionaryWordId: group.controls["translation"].getRawValue(), order: this.words.length });
        this.onTranslationForWordSelected.emit();
        this.formGroups[index].formGroup.reset();
        this.generateHtmlForSentence(this.paragraphs[index].originalParagraph!);
    }

    handleGetWordTranslation(word: Event | null) {
        if (word?.target) {
            //@ts-ignore
            this.onOnWordFieldFilled.emit(word.target.value);
        }
    }

    private generateGroups(): wordTranslationData[] {
        return this.paragraphs
            .sort((p1, p2) => p1.orderInStory! - p2.orderInStory!)
            .map((paragraph) => {
                return {
                    formGroup: this._formBuilder.group({
                        wordKanji: ["", Validators.required],
                        wordKana: ["", Validators.required],
                        dictionaryWord: [""],
                        translation: ["", Validators.required],
                    }),
                    paragraph: { ...paragraph, words: [] },
                };
            });
    }

    private generateHtmlForSentence(paragraph: string) {
        let index = 0;
        this.selectedParagraph = "";
        for (let i = 0; i < paragraph.length; i++) {
            if (index < this.words.length && (paragraph.substring(i).startsWith(this.words[index].wordKanji!) || paragraph.substring(i).startsWith(this.words[index].wordKana!))) {
                this.selectedParagraph += `<span class="${this.doneWordCssClass}">${this.words[index].wordKanji}</span>`;
                i += this.words[index].wordKanji!.length - 1;
                index++;
            } else {
                this.selectedParagraph += paragraph.charAt(i);
            }
        }
    }
}
