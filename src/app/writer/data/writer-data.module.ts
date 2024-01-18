import { NgModule } from "@angular/core";
import { WriterApiService } from "./writer-api.service";
import { WriterStore } from "./writer.store";
import { WriterActions } from "./writer.actions";
import { WriterQueries } from "./writer.queries";


@NgModule({
    providers:[
        WriterApiService,
        WriterStore, 
        WriterActions, 
        WriterQueries
    ]
})
export class WriterDataModule{}