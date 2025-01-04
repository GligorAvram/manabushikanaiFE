import { NgModule } from '@angular/core';
import { WriterApiService } from './writer-api.service';
import { WriterActions } from './writer.actions';
import { WriterQueries } from './writer.queries';
import { WriterStore } from './writer.store';

@NgModule({
    providers:[
        WriterActions,
        WriterQueries,
        WriterStore,
        WriterApiService
    ]
})
export class WriterDataModule{}
