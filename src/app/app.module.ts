import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { storeProviders } from '@shared/data/store.providers';
import { StoryListTableComponent } from "./shared/ui/story-list-table.component";
import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [AppComponent],
    providers: [...storeProviders],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        StoryListTableComponent
    ]
})
export class AppModule {}
