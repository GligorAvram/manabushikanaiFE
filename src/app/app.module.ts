import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { storeProviders } from '@shared/data/store.providers';
import { MessageModule } from '@shared/features/message/message.module';
import { StoryListTableComponent } from '@shared/ui/story-list-table.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    providers: [...storeProviders],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MessageModule,
        BrowserAnimationsModule,
        StoryListTableComponent
    ]
})
export class AppModule {}
