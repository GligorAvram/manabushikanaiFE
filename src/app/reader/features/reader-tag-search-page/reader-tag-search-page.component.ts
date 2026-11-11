import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { SearchScopeEnum, TagDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { ReaderTagSearchDataService } from './reader-tag-search-data.service';

@Component( {
                selector       : 'app-reader-tag-search-page',
                standalone     : false,
                template       : `
                    <app-container>
                        <app-header>
                            <app-title headerLeft title="Browse by tag" [icon]="icon.Tag"></app-title>
                        </app-header>

                        <div class="toolbar">
                            <mat-form-field appearance="outline" class="search">
                                <mat-label>Tag</mat-label>
                                <input
                                    matInput
                                    [formControl]="tagControl"
                                    placeholder="Enter a tag name..."
                                    (keydown.enter)="search()"
                                />
                            </mat-form-field>
                            <mat-form-field appearance="outline" class="scope">
                                <mat-label>Scope</mat-label>
                                <mat-select [formControl]="scopeControl" (selectionChange)="search()">
                                    <mat-option [value]="scopes.ALL">All</mat-option>
                                    <mat-option [value]="scopes.STORIES">Stories</mat-option>
                                    <mat-option [value]="scopes.COLLECTIONS">Collections</mat-option>
                                </mat-select>
                            </mat-form-field>
                            <app-primary-button
                                appButton
                                label="Search"
                                [type]="'button'"
                                [icon]="icon.Tag"
                                (onClick)="search()"
                            ></app-primary-button>
                        </div>

                        <app-container *ngIf="dataService.data$ | async as data">
                            <app-loading-bar [visible]="data.loading"></app-loading-bar>

                            <ng-container *ngIf="searched">
                                <ng-container *ngIf="scopeControl.value !== scopes.COLLECTIONS">
                                    <h3>Stories</h3>
                                    <app-story-list-table
                                        [stories]="data.stories"
                                        [loading]="data.loading"
                                        [showTags]="true"
                                        [clickableTags]="true"
                                        (onRowClick)="navigationService.readerStoryDetails($event?.id!)"
                                        (onTagClick)="onTagClicked($event)"
                                    ></app-story-list-table>
                                </ng-container>

                                <ng-container *ngIf="scopeControl.value !== scopes.STORIES">
                                    <h3>Collections</h3>
                                    <app-collection-list-table
                                        [collections]="data.collections"
                                        [loading]="data.loading"
                                        [showTags]="true"
                                        [clickableTags]="true"
                                        (onRowClick)="navigationService.readerCollectionDetails($event?.id!)"
                                        (onTagClick)="onTagClicked($event)"
                                    ></app-collection-list-table>
                                </ng-container>
                            </ng-container>
                        </app-container>
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

                        .scope {
                            width: 180px;
                        }
                    `
                ],
                providers      : [ ReaderTagSearchDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ReaderTagSearchPageComponent implements OnInit {
    icon = IconEnum;
    scopes = SearchScopeEnum;
    tagControl = new FormControl<string>( '', { nonNullable: true } );
    scopeControl = new FormControl<SearchScopeEnum>( SearchScopeEnum.ALL, { nonNullable: true } );
    searched = false;

    constructor(
        public readonly dataService: ReaderTagSearchDataService,
        public readonly navigationService: NavigationService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );

        const tag = this.route.snapshot.queryParamMap.get( 'tag' );
        if( tag ) {
            this.tagControl.setValue( tag );
            this.search();
        }
    }

    search(): void {
        const tag = this.tagControl.value?.trim();
        if( !tag ) {
            return;
        }
        this.searched = true;
        this.dataService.search( tag, this.scopeControl.value );
    }

    onTagClicked(tag: TagDto): void {
        this.tagControl.setValue( tag.name );
        this.search();
    }
}
