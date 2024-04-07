import { CommonModule } from "@angular/common";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { CreateParagraphTranslationDto, CreateSentenceDto, ParagraphDto } from "app/models/Api";
import { ContainerComponent } from "@shared/ui/container.component";
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { valueIsNotEmpty } from "@shared/functions";

export type translationData = {
    formGroup: FormGroup;
    paragraph: ParagraphDto;
};


@Component({
    selector: "app-paragraph-editor",
    template: ` <app-container>
        <mat-card>
            <mat-stepper [linear]="false" #stepper *ngIf="formGroups" (selectionChange)="onStepChange($event)">
                <mat-step *ngFor="let group of formGroups; let index = index" [completed]="group.paragraph.translationDone" [stepControl]="group.formGroup">
                    <form [formGroup]="group.formGroup" *ngIf="group.paragraph.originalParagraph">
                        <ng-template matStepLabel></ng-template>
                        <div [innerHTML]="selectedParagraph"></div>
                        <mat-form-field class="displayBlock">
                            <mat-label>Sentence</mat-label>
                            <input matInput placeholder="Sentence" formControlName="sentence" required />
                        </mat-form-field>
                        <mat-form-field class="displayBlock">
                            <mat-label>Translation</mat-label>
                            <input matInput placeholder="Translation" formControlName="translation" required />
                        </mat-form-field>
                        <ng-container>
                            <mat-label>Sentences</mat-label>
                            <div cdkDropList (cdkDropListDropped)="drop($event, index)">
                                @for (sentence of sentences; track sentence) {
                                <div cdkDrag>{{ sentence.japaneseSentence }}</div>
                                }
                            </div>
                        </ng-container>
                        <div>
                            <button mat-button (click)="addSentenceTranslation(group.formGroup, index)">Add sentence</button>
                            <button mat-button (click)="submitTranslation(group.paragraph)">Submit</button>
                            <button mat-button matStepperNext>Next</button>
                        </div>
                    </form>
                </mat-step>
                <mat-step>
                    <ng-template matStepLabel>Done</ng-template>
                    <p>You are now done.</p>
                    <div>
                        <button mat-button>Back</button>
                    </div>
                </mat-step>
            </mat-stepper>
        </mat-card>
    </app-container>`,
    standalone: true,
    styles: [
        `
            .displayBlock {
                display: block;
                width: 100%;
            }

            ::ng-deep .grey-out {
                color: #999;
                user-select: none;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, ContainerComponent, MatChipsModule, MatIconModule, CdkDropList, CdkDrag],
})
export class ParagraphEditorComponent implements OnInit , OnChanges{
    sentences!: CreateSentenceDto[];
    selectedParagraph = "";
    @ViewChild("textContent") textContent!: ElementRef;
    doneSentenceCssClass = "grey-out";

    @Input()
    paragraphs!: ParagraphDto[];

    @Output()
    onTranslationSubmitted: EventEmitter<CreateParagraphTranslationDto> = new EventEmitter();

    constructor(private _formBuilder: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['paragraphs']){
            this.formGroups = this.generateGroups();
        }
    }

    ngOnInit(): void {
        this.formGroups = this.generateGroups();
        this.onStepChange({ selectedIndex: 0 } as StepperSelectionEvent);
    }

    formGroups!: translationData[];

    drop(event: CdkDragDrop<CreateSentenceDto[]>, index: number) {
        if (valueIsNotEmpty(this.sentences)) {
            moveItemInArray(this.sentences, event.previousIndex, event.currentIndex);
            this.generateHtmlForSentence(this.paragraphs[index].originalParagraph!);
        }
    }

    addSentenceTranslation(event: FormGroup, index: number) {
        this.sentences.push({ japaneseSentence: event.controls["sentence"].getRawValue(), englishTranslation: event.controls["translation"].getRawValue(), order: this.sentences.length });
        event.reset();
        this.generateHtmlForSentence(this.paragraphs[index].originalParagraph!);
    }

    submitTranslation(paragraph: ParagraphDto) {
        this.onTranslationSubmitted.emit({id: paragraph.id, sentences: this.sentences})
    }

    private generateGroups(): translationData[] {
        return this.paragraphs.sort((p1, p2)=>p1.orderInStory! - p2.orderInStory!).map((paragraph) => {
            return {
                formGroup: this._formBuilder.group({
                    sentence: ["", Validators.required],
                    translation: ["", Validators.required],
                }),
                paragraph,
            };
        });
    }

    add(event: MatChipInputEvent) {
        console.log(event);
        throw new Error("Method not implemented.");
    }

    edit(_t39: any, $event: MatChipEditedEvent) {
        throw new Error("Method not implemented.");
    }
    remove(_t39: any) {
        throw new Error("Method not implemented.");
    }

    onStepChange($event: StepperSelectionEvent) {
        this.sentences = this.paragraphs[$event.selectedIndex].sentences ? this.paragraphs[$event.selectedIndex].sentences!.map((s) => ({ japaneseSentence: s.japaneseSentence, englishTranslation: s.englishTranslation, order: s.order })) : [];
        this.selectedParagraph = this.paragraphs[$event.selectedIndex].originalParagraph!;
        if (valueIsNotEmpty(this.sentences)) {
            this.generateHtmlForSentence(this.paragraphs[$event.selectedIndex].originalParagraph!);
        }
    }

    private generateHtmlForSentence(paragraph: string) {
        let index = 0;
        this.selectedParagraph = "";
        for (let i = 0; i < paragraph.length; i++) {
            if (paragraph.substring(i).startsWith(this.sentences[index].japaneseSentence!)) {
                this.selectedParagraph += `<span class="${this.doneSentenceCssClass}">${this.sentences[index].japaneseSentence}</span>`;
                i += this.sentences[index].japaneseSentence!.length - 1;
                index++;
            } else {
                this.selectedParagraph += paragraph.charAt(i);
            }
        }
    }
}
