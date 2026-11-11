import { CdkDrag, CdkDragHandle, CdkDropList } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { DeleteButtonComponent } from "@shared/ui/buttons/delete-button.component";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { ContainerComponent } from "@shared/ui/container.component";
import { HeaderComponent } from "@shared/ui/header.component";
import { LoadingBarComponent } from "@shared/ui/loading-bar.component";
import { ModalModule } from "@shared/features/modal/modal.module";
import { TitleComponent } from "@shared/ui/title.component";
import { WriterDataModule } from "@writer/data/writer-data.module";
import { WriterCollectionDetailsPageComponent } from "./writer-collection-details-page.component";
import { WriterCollectionDetailsPageRoutingModule } from "./writer-collection-details-page-routing.module";

@NgModule({
  declarations: [WriterCollectionDetailsPageComponent],
  imports: [
    CommonModule,
    WriterCollectionDetailsPageRoutingModule,
    WriterDataModule,
    ContainerComponent,
    LoadingBarComponent,
    HeaderComponent,
    TitleComponent,
    ButtonModule,
    PrimaryButtonComponent,
    DeleteButtonComponent,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    ModalModule
  ],
})
export class WriterCollectionDetailsPageModule {}
