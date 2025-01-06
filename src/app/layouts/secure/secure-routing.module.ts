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
