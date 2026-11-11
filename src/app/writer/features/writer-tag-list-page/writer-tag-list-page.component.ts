import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { TagFormModalData } from '@writer/config/writer.interfaces';
import { TagFormModalComponent } from '@writer/ui/tag-form-modal.component';
import { CreateTagDto, TagDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';
import { WriterTagListDataService } from './writer-tag-list-data.service';

@Component( {
                selector       : 'app-writer-tag-list-page',
                standalone     : false,
                template       : `
                    <app-header>
                        <app-title
                            headerLeft
                            title="Tag management page"
                            [icon]="icon.Tag"
                        ></app-title>
                    </app-header>

                    <div class="toolbar">
                        <mat-form-field appearance="outline" class="search">
                            <mat-label>Search tags</mat-label>
                            <input
                                matInput
                                [formControl]="searchControl"
                                placeholder="Type to filter tags..."
                                (input)="onSearch()"
                            />
                        </mat-form-field>
                        <app-primary-button
                            appButton
                            label="Add tag"
                            [type]="'button'"
                            [icon]="icon.Add"
                            (onClick)="openCreateModal()"
                        ></app-primary-button>
                    </div>

                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>
                        <ng-container *ngIf="data.tags.length > 0 && !data.loading; else noData">
                            <table mat-table [dataSource]="data.tags">
                                <ng-container matColumnDef="name">
                                    <th mat-header-cell *matHeaderCellDef>Name</th>
                                    <td mat-cell *matCellDef="let tag">
                                        <strong>{{ tag.name }}</strong>
                                    </td>
                                </ng-container>
                                <ng-container matColumnDef="actions">
                                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                                    <td mat-cell *matCellDef="let tag">
                                        <div class="actions">
                                            <button
                                                mat-icon-button
                                                type="button"
                                                aria-label="Rename tag"
                                                (click)="openEditModal(tag)"
                                            >
                                                <mat-icon>edit</mat-icon>
                                            </button>
                                            <app-delete-button
                                                appButton
                                                (onClick)="deleteTag(tag)"
                                            ></app-delete-button>
                                        </div>
                                    </td>
                                </ng-container>

                                <tr mat-header-row *matHeaderRowDef="columns"></tr>
                                <tr mat-row *matRowDef="let row; columns: columns"></tr>
                            </table>
                        </ng-container>
                        <ng-template #noData>
                            <em>No tags</em>
                        </ng-template>
                    </app-container>
                `,
                styles         : [
                    `
                        .toolbar {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                            margin-bottom: 10px;
                        }

                        .search {
                            flex: 1 1 auto;
                            max-width: 400px;
                        }

                        .actions {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                    `
                ],
                providers      : [ WriterTagListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WriterTagListPageComponent implements OnInit {
    icon = IconEnum;
    columns: string[] = [ 'name', 'actions' ];
    searchControl = new FormControl<string>( '', { nonNullable: true } );

    constructor(
        public readonly dataService: WriterTagListDataService,
        public readonly modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    onSearch(): void {
        const value = this.searchControl.value.trim();

        // Clearing the box reloads the full list; otherwise wait for 3+ characters.
        if( value.length === 0 ) {
            this.dataService.search( '' );
            return;
        }

        if( value.length < 3 ) {
            return;
        }

        this.dataService.search( value );
    }

    openCreateModal(): void {
        this.modalService.openMdModal<TagFormModalData>(
            TagFormModalComponent,
            this,
            {
                title   : 'Create a new tag',
                loading$: of( false ),
                onSubmit: this.createTag.bind( this ),
                onCancel: this.closeTagFormModal.bind( this )
            }
        );
    }

    openEditModal(tag: TagDto): void {
        this.modalService.openMdModal<TagFormModalData>(
            TagFormModalComponent,
            this,
            {
                title      : `Rename "${ tag.name }"`,
                initialName: tag.name,
                loading$   : of( false ),
                onSubmit   : (data: CreateTagDto) => this.renameTag( tag.id, data ),
                onCancel   : this.closeTagFormModal.bind( this )
            }
        );
    }

    createTag(data: CreateTagDto): void {
        this.dataService.create( data.name );
        this.closeTagFormModal();
    }

    renameTag(tagId: string, data: CreateTagDto): void {
        this.dataService.rename( tagId, data.name );
        this.closeTagFormModal();
    }

    deleteTag(tag: TagDto): void {
        this.dataService.delete( tag.id );
    }

    closeTagFormModal(): void {
        this.modalService.close( TagFormModalComponent );
    }
}
