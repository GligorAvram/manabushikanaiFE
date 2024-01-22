import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { IconEnum } from "@shared/config/enums/icon.enum";
import { NavigationService } from "@shared/features/navigation/navigation.service";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { WriterStoryListDataService } from "./writer-story-list-data.service";
import { ModalService } from "@shared/features/modal/modal.service";
import { StoryCreateFormModalComponent } from "@writer/ui/story-create-form-modal.component";
import { CreateStoryDto } from "app/models/Api";
import { StoryCreateFormModalData } from "@writer/config/writer.interfaces";
import { of } from "rxjs";


@Component({
  selector: 'app-writer-story-list-page',
  template: `
    <app-header>
      <app-title
        headerLeft
        title="Story management page"
        [icon]="icon"
      ></app-title>
    </app-header>
    <app-primary-button
      appButton
      label="Add new story"
      icon="add_icon"
      (onClick)="openStoryCreateFormModal()"
    ></app-primary-button>

    <app-container *ngIf="dataService.data$ | async as data">
      <app-story-list-table
        [stories]="data.entities"
        [loading]="data.loading"
        (onRowClick)="navigationService.writerStoryDetails($event.id)"
      ></app-story-list-table>
    </app-container>
  `,
  providers: [WriterStoryListDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WriterStoryListPageComponent implements OnInit {
  icon = IconEnum.Stories;
  add_icon = IconEnum.Dashboard;

  constructor(
    public readonly dataService: WriterStoryListDataService,
    public readonly navigationService: NavigationService,
    public readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.dataService.init(this);
  }

  openStoryCreateFormModal(): void {
    this.modalService.openMdModal<StoryCreateFormModalData>(
      StoryCreateFormModalComponent,
      this,
      {
        //todo
        loading$: of(false),
        onSubmit: this.createStory.bind(this),
        onCancel: this.closeStoryCreateFormModal.bind(this),
      },
    );
  }

  createStory(data: CreateStoryDto): void {
    this.dataService.create(data);
    this.onCreateStorySuccess();
  }
  onCreateStorySuccess() {
    //todo message service
    this.modalService.close(StoryCreateFormModalComponent);
  }

  closeStoryCreateFormModal(): void {
    this.modalService.close(StoryCreateFormModalComponent);
  }
}