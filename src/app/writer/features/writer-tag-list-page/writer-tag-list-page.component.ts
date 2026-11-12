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
                        <button headerRight type="button" class="add-action" (click)="openCreateModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                            New tag
                        </button>
                    </app-header>

                    <div class="toolbar">
                        <div class="search">
                            <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <circle cx="11" cy="11" r="7"></circle>
                                <path d="M21 21l-4-4"></path>
                            </svg>
                            <input
                                class="search__input"
                                type="text"
                                [formControl]="searchControl"
                                placeholder="Search tags…"
                                aria-label="Search tags"
                                (input)="onSearch()"
                            />
                            @if (searchControl.value) {
                                <button class="search__clear" type="button" aria-label="Clear search" (click)="clearSearch()">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                        <path d="M18 6L6 18M6 6l12 12"></path>
                                    </svg>
                                </button>
                            }
                        </div>
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
                            margin-bottom: 14px;
                        }

                        .search {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            max-width: 360px;
                            height: 40px;
                            padding: 0 10px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: 10px;
                            transition: border-color .12s ease, box-shadow .12s ease;
                        }

                        .search:focus-within {
                            border-color: var(--reader-accent);
                            box-shadow: 0 0 0 3px var(--reader-accent-soft);
                        }

                        .search__icon {
                            flex: 0 0 auto;
                            width: 16px;
                            height: 16px;
                            color: var(--reader-muted);
                        }

                        .search__input {
                            flex: 1 1 auto;
                            min-width: 0;
                            border: none;
                            outline: none;
                            background: transparent;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            color: var(--reader-ink);
                        }

                        .search__input::placeholder {
                            color: var(--reader-muted);
                        }

                        .search__clear {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            flex: 0 0 auto;
                            border: none;
                            background: transparent;
                            padding: 2px;
                            cursor: pointer;
                            color: var(--reader-muted);
                        }

                        .search__clear:hover {
                            color: var(--reader-ink);
                        }

                        .search__clear svg {
                            width: 16px;
                            height: 16px;
                        }

                        :host ::ng-deep .mat-column-actions {
                            width: 1%;
                            white-space: nowrap;
                            text-align: right;
                        }

                        .actions {
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            gap: 8px;
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

    clearSearch(): void {
        this.searchControl.setValue( '' );
        this.dataService.search( '' );
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
