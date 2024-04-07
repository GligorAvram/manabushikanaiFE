import { Injectable } from "@angular/core";
import { ComponentDataSource, EntityDetailsComponentDataService } from "@shared/data/component-data.service";
import { getParamFromRoute } from "@shared/functions";
import { WriterActions } from "@writer/data/writer.actions";
import { WriterQueries } from "@writer/data/writer.queries";
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, StoryDto } from "app/models/Api";

interface WriterStoryDetailsComponentData {
    story: StoryDto | null;
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

    submitTranslationForParagraph(paragraph: CreateParagraphTranslationDto) {
        this.writerActions.submitTranslationForParagraph(paragraph);
    }

    protected dataSource(): ComponentDataSource<WriterStoryDetailsComponentData> {
        return {
            story: this.writerQueries.selectActive(),
            loading: this.writerQueries.selectLoading(),
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
}
