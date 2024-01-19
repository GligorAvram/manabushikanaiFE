import { NgModule } from "@angular/core";
import { WriterActions } from "./writer.actions";
import { WriterQueries } from "./writer.queries";
import { WriterStore } from "./writer.store";
import { WriterApiService } from "./writer-api.service";

@NgModule({
    providers:[
        WriterActions,
        WriterQueries,
        WriterStore,
        WriterApiService
    ]
})
export class WriterDataModule{}