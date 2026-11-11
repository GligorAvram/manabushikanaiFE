import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';
import { SecureComponent } from './secure.component';

const routes: Routes = [
    {
        path     : '',
        component: SecureComponent,
        children : [
            {
                path        : AppR.dashboard.simple,
                loadChildren: () =>
                    import('@dashboard/dashboard-page.module').then(
                        (m) => m.DashboardPageModule
                    )
            },
            {
                path        : AppR.profile.simple,
                loadChildren: () =>
                    import('@profile/profile-page.module').then(
                        (m) => m.ProfilePageModule
                    )
            },
            {
                path        : AppR.settings.simple,
                loadChildren: () =>
                    import('@settings/settings-page.module').then(
                        (m) => m.SettingsPageModule
                    )
            },
            {
                path        : AppR.reader.stories.list.simple,
                loadChildren: () =>
                    import(
                        '@reader/features/reader-shell/reader-shell.module'
                        ).then( (m) => m.ReaderShellModule )
            },
            {
                path        : AppR.writer.list.simple,
                loadChildren: () =>
                    import(
                        '@writer/features/writer-shell/writer-shell.module'
                        ).then( (m) => m.WriterShellModule )
            },
            {
                path        : AppR.reader.collections.list.simple,
                loadChildren: () =>
                    import(
                        '@reader/features/reader-collection-shell/reader-collection-shell.module'
                        ).then( (m) => m.ReaderCollectionShellModule )
            },
            {
                path        : AppR.writer.collections.list.simple,
                loadChildren: () =>
                    import(
                        '@writer/features/writer-collection-shell/writer-collection-shell.module'
                        ).then( (m) => m.WriterCollectionShellModule )
            },
            {
                path        : AppR.writer.tags.list.simple,
                loadChildren: () =>
                    import(
                        '@writer/features/writer-tag-list-page/writer-tag-list-page.module'
                        ).then( (m) => m.WriterTagListPageModule )
            }
        ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class SecureRoutingModule {
}
