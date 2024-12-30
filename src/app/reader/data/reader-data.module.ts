import {NgModule} from "@angular/core";
import {ReaderActions} from "@reader/data/reader.actions";
import {ReaderStore} from "@reader/data/reader.store";
import {ReaderQueries} from "@reader/data/reader.queries";
import {ReaderApiService} from "@reader/data/reader-api.service";


@NgModule({
  providers: [
    ReaderActions,
    ReaderQueries,
    ReaderStore,
    ReaderApiService
  ]
})
export class ReaderDataModule {
}
