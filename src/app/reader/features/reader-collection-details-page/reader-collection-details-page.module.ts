import { AsyncPipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReaderDataModule } from '@reader/data/reader-data.module';
import { StoryListCardComponent } from '@reader/ui/story-list-card.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { ReaderCollectionDetailsPageRoutingModule } from './reader-collection-details-page-routing.module';
import { ReaderCollectionDetailsPageComponent } from './reader-collection-details-page.component';

@NgModule( {
               declarations: [ ReaderCollectionDetailsPageComponent ],
               imports     : [
                   ReaderCollectionDetailsPageRoutingModule,
                   ContainerComponent,
                   HeaderComponent,
                   TitleComponent,
                   AsyncPipe,
                   NgIf,
                   ReaderDataModule,
                   StoryListCardComponent
               ]
           } )
export class ReaderCollectionDetailsPageModule {
}
