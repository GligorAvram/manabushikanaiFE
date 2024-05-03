import { Injectable } from "@angular/core";
import { ComponentDataSource, EntityDetailsComponentDataService } from "@shared/data/component-data.service";
import { getParamFromRoute } from "@shared/functions";
import { WriterActions } from "@writer/data/writer.actions";
import { WriterQueries } from "@writer/data/writer.queries";
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, StoryDto } from "app/models/Api";

interface WriterStoryDetailsComponentData {
    story: StoryDto | null;
    possibleWordTranslations: DictionaryWordDto[];
    loading: boolean;
}

@Injectable()
export class WriterStoryDetailsDataService extends EntityDetailsComponentDataService<StoryDto, WriterStoryDetailsComponentData> {
    constructor(
        private readonly writerActions: WriterActions,
        private readonly writerQueries: WriterQueries,
    ) {
        super(writerQueries);
    }

    protected dataSource(): ComponentDataSource<WriterStoryDetailsComponentData> {
        return {
            story: this.writerQueries.selectActive(),
            loading: this.writerQueries.selectLoading(),
            possibleWordTranslations: this.writerQueries.selectPossibleWordTranslations(),
        };
    }

    protected override onInit(): void {
        this.loadStory();
    }

    private loadStory() {
        const id = getParamFromRoute("id", this._route);

        if (id) {
            this.writerActions.loadStoryById(id);
        }
    }

    submitWordToDictionary(word: CreateDictionaryWordDto) {
        this.writerActions.submitDictionaryWord(word);
    }

    submitSentenceTranslationForParagraph(sentenceTranslation: CreateParagraphTranslationDto) {
        this.writerActions.submitSentenceTranslationForParagraph(sentenceTranslation);
    }

    submitWordsTranslationForParagraph(wordTranslation: CreateWordTranslationForParagraphDto) {
        this.writerActions.submitWordTranslationForParagraph(wordTranslation);
    }

    getTranslationForWord(word: string) {
        this.writerActions.getTranslationForWord(word);
    }

    clearPossibleDictionaryWordList() {
        this.writerActions.clearPossibleDictionaryWordList();
    }
}
