import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () =>
            import(
                '@writer/features/writer-collection-list-page/writer-collection-list-page.module'
                ).then( (m) => m.WriterCollectionListPageModule )
    },
    {
        path        : AppR.writer.collections.details.simple,
        loadChildren: () =>
            import(
                '@writer/features/writer-collection-details-page/writer-collection-details-page.module'
                ).then( (m) => m.WriterCollectionDetailsPageModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class WriterCollectionShellRoutingModule {
}
