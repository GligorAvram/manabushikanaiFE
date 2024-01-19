import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppR } from "@shared/config/constants/routes";

@Injectable({ providedIn: 'root' })
export class NavigationService {
storyDetails(arg0: string) {
throw new Error('Method not implemented.');
}
  constructor(private readonly router: Router) {}

  async navigateTo(url: string): Promise<void> {
    await this.router.navigateByUrl(url);
  }

  root(): void {
    this.navigateTo(AppR.root).then();
  }

  dashboard(): void {
    this.navigateTo(AppR.dashboard.full).then();
  }

  readerStoryList(): void {
    this.navigateTo(AppR.reader.stories.list.full).then();
  }

  readerStoryDetails(storyId: string): void {
    this.navigateTo(`${AppR.reader.stories.list.full}/{storyId}`).then();
  }

  writerStoryList(): void {
    this.navigateTo(AppR.writer.list.full).then();
  }

  writerStoryDetails(storyId: string): void {
    this.navigateTo(`${AppR.writer.list.full}/{storyId}`).then();
  }

  writerCreateStory(): void {
    this.navigateTo(AppR.writer.create.full).then();
  }
}