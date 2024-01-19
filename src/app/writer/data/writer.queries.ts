import { Injectable } from "@angular/core";
import { BaseEntityQuery, BaseQuery } from "@shared/data/base.query";
import { WriterState, WriterStore } from "./writer.store";
import { Observable } from "rxjs";
import { StoryDto } from "app/models/Api";
import { HashMap } from "@datorama/akita";

@Injectable()
export class WriterQueries extends BaseEntityQuery<StoryDto, WriterState>{

    constructor(private readonly writerStore: WriterStore){
        super(writerStore);
    }

    selectEntities():Observable<StoryDto[]>  {
        return this.select(state => state.entities ?? []);
    }
}