import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ReaderDataModule } from "@reader/data/reader-data.module";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { CollectionListTableComponent } from "@shared/ui/collection-list-table.component";
import { ContainerComponent } from "@shared/ui/container.component";
import { HeaderComponent } from "@shared/ui/header.component";
import { LoadingBarComponent } from "@shared/ui/loading-bar.component";
import { StoryListTableComponent } from "@shared/ui/story-list-table.component";
import { TitleComponent } from "@shared/ui/title.component";
import { ReaderTagSearchPageComponent } from './reader-tag-search-page.component';
import { ReaderTagSearchPageRoutingModule } from "./reader-tag-search-page-routing.module";

@NgModule({
  declarations: [ReaderTagSearchPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReaderTagSearchPageRoutingModule,
    ReaderDataModule,
    ContainerComponent,
    LoadingBarComponent,
    HeaderComponent,
    TitleComponent,
    ButtonModule,
    PrimaryButtonComponent,
    StoryListTableComponent,
    CollectionListTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
})
export class ReaderTagSearchPageModule {}
