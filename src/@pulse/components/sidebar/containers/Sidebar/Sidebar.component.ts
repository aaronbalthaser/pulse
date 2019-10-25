import { Component, OnInit, OnDestroy, Input, Output, HostBinding, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService, PulseMediaService } from '@pulse/services';
import { PulseSidebarService } from '@pulse/components/sidebar/services';

@Component({
  selector: 'pulse-sidebar',
  styleUrls: ['./sidebar.component.scss'],
  templateUrl: './sidebar.component.html'
})

export class PulseSidebarComponent implements OnInit, OnDestroy {

  // Name
  @Input() name: string;

  // Key
  @Input() key: string;

  // Position
  @Input() position: 'left' | 'right';

  // Open
  @HostBinding('class.open') opened: boolean;

  // Locked Open
  @Input() lockedOpen: string;

  // Is Locked Open
  @HostBinding('class.locked-open') isLockedOpen: boolean;

  // Folded Width
  @Input() foldedWidth: number;

  // Folded Auto Trigger On Hover
  @Input() foldedAutoTriggerOnHover: boolean;

  // Folded Unfolded
  @HostBinding('class.unfolded') unfolded: boolean;

  // Invisible Overlay
  @Input() invisibleOverlay: boolean;

  // Folded Changed
  @Output() foldedChanged: EventEmitter<boolean>;

  // Opened Changed
  @Output() openedChanged: EventEmitter<boolean>;

  // Private
  private _config: any;
  private _folded: boolean;
  private _wasActive: boolean;
  private _wasFolded: boolean;
  private _backdrop: HTMLElement | null = null;
  private _player: AnimationPlayer;
  private _unsubscribeAll: Subject<any>;

  @HostBinding('class.animations-enabled')
  private _animationsEnabled: boolean;

  /**
   * Constructor
   *
   * @param {PulseConfigService} _pulseConfigService
   * @param {PulseMediaService} _pulseMediaService
   * @param {PulseSidebarService} _pulseSidebarService
   * @param {MediaObserver} _mediaObserver
   * @param {ElementRef} _elementRef
   * @param {Renderer2} _renderer
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {AnimationBuilder} _animationBuilder
   */
  constructor(
    private _pulseConfigService: PulseConfigService,
    private _pulseMediaService: PulseMediaService,
    private _pulseSidebarService: PulseSidebarService,
    private _mediaObserver: MediaObserver,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _animationBuilder: AnimationBuilder
  ) {

    // Set the defaults
    this.foldedAutoTriggerOnHover = true;
    this.foldedWidth = 64;
    this.foldedChanged = new EventEmitter();
    this.openedChanged = new EventEmitter();
    this.opened = false;
    this.position = 'left';
    this.invisibleOverlay = false;

    // Set the private defaults
    this._animationsEnabled = false;
    this._folded = false;
    this._unsubscribeAll = new Subject();
  }



  ngOnInit(): void {
    this._pulseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this._config = config;

        console.log(this._config);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
