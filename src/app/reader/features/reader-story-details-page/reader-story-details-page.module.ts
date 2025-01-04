import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ReaderDataModule } from '@reader/data/reader-data.module';
import { ReaderStoryDetailsPageRoutingModule } from '@reader/features/reader-story-details-page/reader-story-details-page-routing.module';
import { ReaderStoryDetailsPageComponent } from '@reader/features/reader-story-details-page/reader-story-details-page.component';
import { SentenceDisplayComponent } from '@reader/ui/sentence-display.component';
import { WordDisplayComponent } from '@reader/ui/word-display.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SliderComponent } from '@shared/ui/slider.component';
import { SentenceEditorComponent } from '@writer/ui/sentence-editor.component';
import { WordEditorComponent } from '@writer/ui/word-editor.component';

@NgModule( {
               declarations: [ ReaderStoryDetailsPageComponent ],
               imports: [
                   CommonModule,
                   ReaderStoryDetailsPageRoutingModule,
                   ContainerComponent,
                   LoadingBarComponent,
                   SliderComponent,
                   ReaderDataModule,
                   MatPaginator,
                   SentenceEditorComponent,
                   WordEditorComponent,
                   SentenceDisplayComponent,
                   WordDisplayComponent
               ]
           } )
export class ReaderStoryDetailsPageModule {
}
