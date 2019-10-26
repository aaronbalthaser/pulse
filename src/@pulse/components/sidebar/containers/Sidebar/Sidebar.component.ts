import { Component, OnInit, OnDestroy, Input, Output, HostBinding, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService, PulseMediaService } from '@pulse/services';
import { PulseSidebarService } from '@pulse/components/sidebar/services';

import constants from '../../sidebar.constants';

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

  @Input() set folded(value: boolean) {
    // Set the folded
    this._folded = value;

    // Return if the sidebar is closed
    if (!this.opened) {
      return;
    }
  }

  get folded(): boolean {
    return this._folded;
  }

  ngOnInit(): void {
    this._pulseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this._config = config;
      });

    // Register the sidebar
    this._pulseSidebarService.register(this.name, this);

    // Setup visibility
    this._setupVisibility();

    // Setup position
    this._setupPosition();

    // Setup lockedOpen
    this._setupLockedOpen();

    // Setup folded
    this._setupFolded();

    this._console()
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * ===========================
   * Private Methods
   * ===========================
   */

  // Hides the element
  private _setupVisibility(): void {

    // Remove the exitsting box-shadow
    this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

    // Make the sidebar invisible
    this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
  }

  private _setupPosition() {
    const position = this.position === 'right'
      ? constants.positionRt
      : constants.positionLt;

    this._renderer.addClass(this._elementRef.nativeElement, position);
  }

  private _setupLockedOpen() {
    if (!this.lockedOpen) {
      return;
    }

    // Set the wasActive for the first time
    this._wasActive = false;

    this._wasFolded = this.folded;

    this._showSidebar();

    this._pulseMediaService.onMediaChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {

        // Not working
        const isActive = this._mediaObserver.isActive(this.lockedOpen);

        // If the both status are the same, don't act
        if (this._wasActive === isActive) {
          return;
        }

        if (isActive) {
          // Set the lockedOpen status
          this.isLockedOpen = true;

          // Show the sidebar
          this._showSidebar();

          // Force the the opened status to true
          this.opened = true;

          // Emit the 'openedChanged' event
          this.openedChanged.emit(this.opened);

          // Hide the backdrop if any exists
          this._hideBackdrop();
        } else {

        }
      });
  }

  private _setupFolded() {

    // Return, if sidebar is not folded
    if (!this.folded) {
      return;
    }

    // Return if the sidebar is closed
    if (!this.opened) {
      return;
    }
  }

  private _showSidebar() {

    // Remove the box-shadow style
    this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

    // Make the sidebar invisible
    this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  private _console() {
    let el = this._elementRef.nativeElement;
  }

  /**
  * Enable the animations
  *
  * @private
  */
  private _enableAnimations(): void {

    // Return if animations already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Hide the backdrop
   *
   * @private
   */
  private _hideBackdrop(): void {
    if (!this._backdrop) {
      return;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
