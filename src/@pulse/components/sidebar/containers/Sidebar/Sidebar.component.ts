import { Component, OnInit, OnDestroy, Input, Output, HostBinding, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef, HostListener, ViewEncapsulation } from '@angular/core';
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
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None
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

  /**
   * ===========================
   * Accessors
   * ===========================
   */

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

  /**
   * ===========================
   * Lifecycle Methods
   * ===========================
   */
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

    // DEBUG - DELETE THIS
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

        /**
         * If both status are the same, don't act. This will happen during 
         * initial load when the sidenav is not locked open and is instead
         * collapsed.
         */
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

          this.isLockedOpen = false;

          this.opened = false;

          this.openedChanged.emit(this.opened);

          this._hideSidebar();
        }

        // Store the new active status
        this._wasActive = isActive;
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

  private _hideBackdrop(): void {
    if (!this._backdrop) {
      return;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  private _showSidebar() {
    this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

    this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

    this._changeDetectorRef.markForCheck();
  }

  private _hideSidebar(isDelayed = true): void {
    const delay = isDelayed ? 300 : 0;

    setTimeout(() => {
      this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

      this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    }, delay);

    this._changeDetectorRef.markForCheck();
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
   * ===========================
   * Public Methods
   * ===========================
   */

  public unfoldTemporarily() {
    if (!this.folded) {
      return;
    }

    this._enableAnimations();

    this.unfolded = true;

    // Remove the folded width
    this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
    this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
    this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  public foldTemporarily() {

    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    this._enableAnimations();

    // Fold the sidebar back
    this.unfolded = false;

    // Set the folded width
    const styleValue = this.foldedWidth + 'px';

    this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
    this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
    this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * ===========================
   * Host Listeners
   * ===========================
   */

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.foldedAutoTriggerOnHover) {
      return;
    }

    this.unfoldTemporarily();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.foldedAutoTriggerOnHover) {
      return;
    }

    this.foldTemporarily();
  }

  // DEBUG - DELETE THIS
  private _console() {
    let el = this._elementRef.nativeElement;
  }
}
