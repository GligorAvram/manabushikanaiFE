import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StoryDifficultyEnum, StoryDto } from '@models/Api';
import { valueIsNotEmpty } from '@shared/functions';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner.component';

@Component( {
                selector       : 'app-story-list-cards',
                standalone     : true,
                template       : `
                    @if (loading) {
                        <div class="state"><app-loading-spinner [visible]="true"></app-loading-spinner></div>
                    } @else if (!stories.length) {
                        <div class="state state--empty">No stories yet.</div>
                    } @else {
                        <div class="story-grid">
                            @for (story of stories; track story.id) {
                                <button type="button" class="story-card" (click)="cardClicked(story)">
                                    <span class="cover"
                                          [class.cover--empty]="!story.image"
                                          [style.background-image]="story.image ? 'url(' + story.image + ')' : null">
                                        @if (!story.image) {
                                            <span class="cover__char">{{ firstChar(story) }}</span>
                                        }
                                        <span class="difficulty" [style.background-color]="difficultyColor(story.difficulty)">
                                            {{ difficultyLabel(story.difficulty) }}
                                        </span>
                                    </span>
                                    <span class="body">
                                        <span class="titles">
                                            <span class="jp">{{ story.japaneseName || story.name }}</span>
                                            <span class="en">{{ story.name }}</span>
                                        </span>
                                        @if (story.description) {
                                            <span class="desc">{{ story.description }}</span>
                                        }
                                        @if (story.tags?.length) {
                                            <span class="tags">
                                                @for (tag of story.tags; track tag.id) {
                                                    <span class="tag">{{ tag.name }}</span>
                                                }
                                            </span>
                                        }
                                        @if (story.storyOrigin) {
                                            <span class="foot">{{ story.storyOrigin }}</span>
                                        }
                                    </span>
                                </button>
                            }
                        </div>
                    }
                `,
                styles         : [
                    `
                        .story-grid {
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

                        .story-card {
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

                        .story-card:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 14px 30px -16px rgba(28, 27, 24, .35);
                            border-color: #d8d2c4;
                        }

                        .story-card:focus-visible {
                            outline: 2px solid var(--reader-accent);
                            outline-offset: 2px;
                        }

                        .cover {
                            position: relative;
                            display: flex;
                            height: 132px;
                            background-size: cover;
                            background-position: center;
                            background-color: #ece7da;
                        }

                        .cover--empty {
                            align-items: center;
                            justify-content: center;
                            background: linear-gradient(135deg, #eef1f8, #e7e3d8);
                        }

                        .cover__char {
                            font-family: var(--font-reading);
                            font-size: 56px;
                            color: var(--reader-accent);
                            opacity: .45;
                        }

                        .difficulty {
                            position: absolute;
                            top: 10px;
                            left: 12px;
                            padding: 3px 9px;
                            border-radius: 999px;
                            font-size: 11px;
                            font-weight: 700;
                            color: #fff;
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

                        .foot {
                            font-size: 12px;
                            color: var(--reader-muted);
                        }
                    `
                ],
                imports        : [ CommonModule, LoadingSpinnerComponent ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class StoryListCardComponent {
    @Input()
    stories!: StoryDto[];

    @Output()
    onCardClick: EventEmitter<StoryDto> = new EventEmitter();

    @Input()
    loading: boolean = true;

    private readonly difficultyColors: Record<StoryDifficultyEnum, string> = {
        [StoryDifficultyEnum.EASIEST]    : '#2f8f7e',
        [StoryDifficultyEnum.EASY]       : '#4f9a54',
        [StoryDifficultyEnum.MEDIUM]     : '#c79a2e',
        [StoryDifficultyEnum.DIFFICULT]  : '#c0562f',
        [StoryDifficultyEnum.CHALLENGING]: '#9e3b3b'
    };

    cardClicked(story: StoryDto): void {
        if( valueIsNotEmpty( story ) ) {
            this.onCardClick.emit( story );
        }
    }

    firstChar(story: StoryDto): string {
        return (story.japaneseName || story.name || '').charAt( 0 );
    }

    difficultyColor(difficulty: StoryDifficultyEnum): string {
        return this.difficultyColors[difficulty] ?? '#6b675c';
    }

    difficultyLabel(difficulty: StoryDifficultyEnum): string {
        if( !difficulty ) {
            return '';
        }
        return difficulty.charAt( 0 ) + difficulty.slice( 1 ).toLowerCase();
    }
}
