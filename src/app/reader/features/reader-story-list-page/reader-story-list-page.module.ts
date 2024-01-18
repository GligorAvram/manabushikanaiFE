import { NgModule } from "@angular/core";
import { ReaderStoryListPageComponent } from "./reader-story-list-page.component";
import { ContainerComponent } from "@shared/ui/container.component";
import { StoryListTableComponent } from "@shared/ui/story-list-table.component";
import { ReaderStoryListPageRoutingModule } from "./reader-story-list-page-routing.module";

@NgModule({
    declarations: [ReaderStoryListPageComponent],
    imports: [
                ReaderStoryListPageRoutingModule,
                ContainerComponent, 
                StoryListTableComponent
            ]
})
export class ReaderStoryListPageModule {}
