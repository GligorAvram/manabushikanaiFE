import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionDto } from '@models/Api';
import { valueIsNotEmpty } from '@shared/functions';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner.component';

@Component( {
                selector       : 'app-collection-list-cards',
                standalone     : true,
                template       : `
                    @if (loading) {
                        <div class="state"><app-loading-spinner [visible]="true"></app-loading-spinner></div>
                    } @else if (!collections.length) {
                        <div class="state state--empty">No collections yet.</div>
                    } @else {
                        <div class="collection-grid">
                            @for (collection of collections; track collection.id) {
                                <button type="button" class="collection-card" (click)="cardClicked(collection)">
                                    <span class="banner">
                                        <span class="banner__char">{{ firstChar(collection) }}</span>
                                    </span>
                                    <span class="body">
                                        <span class="titles">
                                            <span class="jp">{{ collection.japaneseName || collection.name }}</span>
                                            <span class="en">{{ collection.name }}</span>
                                        </span>
                                        @if (collection.description) {
                                            <span class="desc">{{ collection.description }}</span>
                                        }
                                        @if (collection.tags?.length) {
                                            <span class="tags">
                                                @for (tag of collection.tags; track tag.id) {
                                                    <span class="tag">{{ tag.name }}</span>
                                                }
                                            </span>
                                        }
                                    </span>
                                </button>
                            }
                        </div>
                    }
                `,
                styles         : [
                    `
                        .collection-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                            gap: 20px;
                            padding: 4px;
                        }

                        .state {
                            display: flex;
                            justify-content: center;
                            padding: 48px 0;
                        }

                        .state--empty {
                            color: var(--reader-muted);
                            font-family: var(--font-ui);
                        }

                        .collection-card {
                            display: flex;
                            flex-direction: column;
                            text-align: left;
                            padding: 0;
                            border: 1px solid var(--reader-line);
                            border-radius: var(--reader-radius);
                            background: var(--reader-panel);
                            overflow: hidden;
                            cursor: pointer;
                            font-family: var(--font-ui);
                            transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
                        }

                        .collection-card:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 14px 30px -16px rgba(28, 27, 24, .35);
                            border-color: #d8d2c4;
                        }

                        .collection-card:focus-visible {
                            outline: 2px solid var(--reader-accent);
                            outline-offset: 2px;
                        }

                        .banner {
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 96px;
                            background: linear-gradient(135deg, var(--reader-accent-soft), #e7e3d8);
                        }

                        .banner__char {
                            font-family: var(--font-reading);
                            font-size: 44px;
                            color: var(--reader-accent);
                            opacity: .5;
                        }

                        .body {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                            padding: 14px 15px 16px;
                        }

                        .titles {
                            display: flex;
                            flex-direction: column;
                            gap: 1px;
                        }

                        .jp {
                            font-family: var(--font-jp);
                            font-weight: 700;
                            font-size: 17px;
                            color: var(--reader-ink);
                        }

                        .en {
                            font-size: 13px;
                            color: var(--reader-ink-soft);
                        }

                        .desc {
                            font-size: 13px;
                            line-height: 1.45;
                            color: var(--reader-ink-soft);
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }

                        .tags {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 6px;
                        }

                        .tag {
                            font-size: 11px;
                            padding: 2px 8px;
                            border-radius: 6px;
                            background: #f2efe6;
                            color: #6b675c;
                        }
                    `
                ],
                imports        : [ CommonModule, LoadingSpinnerComponent ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class CollectionListCardComponent {
    @Input()
    collections!: CollectionDto[];

    @Output()
    onCardClick: EventEmitter<CollectionDto> = new EventEmitter();

    @Input()
    loading: boolean = true;

    cardClicked(collection: CollectionDto): void {
        if( valueIsNotEmpty( collection ) ) {
            this.onCardClick.emit( collection );
        }
    }

    firstChar(collection: CollectionDto): string {
        return (collection.japaneseName || collection.name || '').charAt( 0 );
    }
}
