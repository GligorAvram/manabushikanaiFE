import { NgModule } from "@angular/core";
import { ReaderStoryListPageComponent } from "./reader-story-list-page.component";
import { ContainerComponent } from "@shared/ui/container.component";
import { StoryListTableComponent } from "@shared/ui/story-list-table.component";
import { ReaderStoryListPageRoutingModule } from "./reader-story-list-page-routing.module";
import { HeaderComponent } from "@shared/ui/header.component";
import { TitleComponent } from "@shared/ui/title.component";

@NgModule({
    declarations: [ReaderStoryListPageComponent],
    imports: [
        ReaderStoryListPageRoutingModule,
        ContainerComponent,
        StoryListTableComponent,
        HeaderComponent,
        TitleComponent
    ]
})
export class ReaderStoryListPageModule {}
