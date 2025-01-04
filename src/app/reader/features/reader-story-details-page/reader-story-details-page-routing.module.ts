import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderStoryDetailsPageComponent } from '@reader/features/reader-story-details-page/reader-story-details-page.component';

const routes: Routes = [
    {
        path     : '',
        component: ReaderStoryDetailsPageComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ReaderStoryDetailsPageRoutingModule {
}
