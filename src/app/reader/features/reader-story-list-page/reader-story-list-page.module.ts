import { AsyncPipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReaderDataModule } from '@reader/data/reader-data.module';
import { StoryListCardComponent } from '@reader/ui/story-list-card.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { StoryListTableComponent } from '@shared/ui/story-list-table.component';
import { TitleComponent } from '@shared/ui/title.component';
import { ReaderStoryListPageRoutingModule } from './reader-story-list-page-routing.module';
import { ReaderStoryListPageComponent } from './reader-story-list-page.component';

@NgModule( {
               declarations: [ ReaderStoryListPageComponent ],
               imports     : [
                   ReaderStoryListPageRoutingModule,
                   ContainerComponent,
                   StoryListTableComponent,
                   HeaderComponent,
                   TitleComponent,
                   AsyncPipe,
                   NgIf,
                   ReaderDataModule,
                   StoryListCardComponent
               ]
           } )
export class ReaderStoryListPageModule {
}
