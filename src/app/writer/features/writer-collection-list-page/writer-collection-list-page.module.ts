import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WriterCollectionListPageComponent } from './writer-collection-list-page.component';
import { WriterCollectionListPageRoutingModule } from "./writer-collection-list-page-routing.module";
import { ContainerComponent } from "@shared/ui/container.component";
import { CollectionListTableComponent } from "@shared/ui/collection-list-table.component";
import { WriterDataModule } from "@writer/data/writer-data.module";
import { HeaderComponent } from "@shared/ui/header.component";
import { TitleComponent } from "@shared/ui/title.component";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { ModalModule } from "@shared/features/modal/modal.module";


@NgModule({
  declarations: [WriterCollectionListPageComponent],
  imports: [
    CommonModule,
    WriterCollectionListPageRoutingModule,
    ContainerComponent,
    CollectionListTableComponent,
    WriterDataModule,
    HeaderComponent,
    TitleComponent,
    ButtonModule,
    PrimaryButtonComponent,
    ModalModule
    ],
})
export class WriterCollectionListPageModule {}
