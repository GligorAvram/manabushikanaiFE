import { AsyncPipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReaderDataModule } from '@reader/data/reader-data.module';
import { CollectionListCardComponent } from '@reader/ui/collection-list-card.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { ReaderCollectionListPageRoutingModule } from './reader-collection-list-page-routing.module';
import { ReaderCollectionListPageComponent } from './reader-collection-list-page.component';

@NgModule( {
               declarations: [ ReaderCollectionListPageComponent ],
               imports     : [
                   ReaderCollectionListPageRoutingModule,
                   ContainerComponent,
                   HeaderComponent,
                   TitleComponent,
                   AsyncPipe,
                   NgIf,
                   ReaderDataModule,
                   CollectionListCardComponent
               ]
           } )
export class ReaderCollectionListPageModule {
}
