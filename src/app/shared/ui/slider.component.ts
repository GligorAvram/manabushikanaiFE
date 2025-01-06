import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IconEnum } from '@shared/config/enums/icon.enum';

@Component( {
                standalone     : true,
                selector       : 'app-slider',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template       : `
                    <ng-container>
    <span>{{ leftOption }}</span
    >
                        <mat-slide-toggle
                            #iconSwitch
                            (change)="change()"
                            [checked]="checked"
                            [disabled]="disabled"
                        ><span>{{ rightOption }}</span></mat-slide-toggle
                        >
                    </ng-container>`,
                imports        : [ MatSlideToggleModule, CommonModule ]
            } )
export class SliderComponent implements AfterViewInit {
    @ViewChild( 'iconSwitch', { read: ElementRef } ) element:
                                                         | ElementRef
                                                         | undefined;
    @Input()
    disabled = false;
    @Input()
    checked = false;
    @Input()
    leftOption: any;
    @Input()
    rightOption!: any;
    @Output()
    onChange = new EventEmitter<any>();

    constructor(private renderer: Renderer2) {
    }

    ngAfterViewInit() {
        this.setIcon();
    }

    change() {
        this.checked = !this.checked;
        this.checked
        ? this.onChange.emit( this.rightOption )
        : this.onChange.emit( this.leftOption );
    }

    setIcon() {
        if( this.element ) {
            const targetSpan: HTMLElement = this.element.nativeElement.querySelector(
                '.mat-slide-toggle-thumb'
            );
            this.element.nativeElement
                .querySelector( '.mdc-switch__icon--on' )
                .firstChild
                .setAttribute( 'd', IconEnum.SliderRightIcon );
            this.element.nativeElement
                .querySelector( '.mdc-switch__icon--off' )
                .firstChild
                .setAttribute( 'd', IconEnum.SliderLeftIcon );
        }
    }
}
