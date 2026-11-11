import { Injectable } from '@angular/core';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { WriterState } from '@writer/data/writer.store';
import { TagDto } from 'app/models/Api';

interface WriterTagListComponentData {
    tags: TagDto[];
}

@Injectable()
export class WriterTagListDataService extends BaseComponentDataService<
    WriterTagListComponentData,
    WriterState
> {
    constructor(
        private readonly writerActions: WriterActions,
        private readonly writerQueries: WriterQueries
    ) {
        super( writerQueries );
    }

    protected override onInit(): void {
        this.writerActions.loadAllTags();
    }

    protected override dataSource(): ComponentDataSource<WriterTagListComponentData> {
        return {
            tags: this.writerQueries.selectTags()
        };
    }

    search(name: string): void {
        this.writerActions.loadAllTags( name );
    }

    create(name: string): void {
        this.writerActions.createTag( { name } );
    }

    rename(tagId: string, name: string): void {
        this.writerActions.editTag( tagId, { name } );
    }

    delete(tagId: string): void {
        this.writerActions.deleteTag( tagId );
    }
}
