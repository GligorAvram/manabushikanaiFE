import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () =>
            import(
                '@reader/features/reader-collection-list-page/reader-collection-list-page.module'
                ).then( (m) => m.ReaderCollectionListPageModule )
    },
    {
        path        : AppR.reader.collections.details.simple,
        loadChildren: () =>
            import(
                '@reader/features/reader-collection-details-page/reader-collection-details-page.module'
                ).then( (m) => m.ReaderCollectionDetailsPageModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ReaderCollectionShellRoutingModule {
}
