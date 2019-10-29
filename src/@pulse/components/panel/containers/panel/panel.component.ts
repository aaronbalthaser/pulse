import { Component, OnInit, OnDestroy, Input, Output, HostBinding, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef, HostListener, ViewEncapsulation } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, animate, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService, PulseMediaService } from '@pulse/services';
import { PulsePanelService } from '@pulse/components/panel/services';

import constants from '../../panel.constants';

/**
 * Generic panel component.
 * 
 * Required:
 * - Name: name - maps the component to the service.
 * - Input: folded - overrides default rendering 
 */
@Component({
  selector: 'pulse-panel',
  styleUrls: ['./panel.component.scss'],
  templateUrl: './panel.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PulsePanelComponent implements OnInit, OnDestroy {

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
   * @param {PulsePanelService} _pulsePanelService
   * @param {MediaObserver} _mediaObserver
   * @param {ElementRef} _elementRef
   * @param {Renderer2} _renderer
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {AnimationBuilder} _animationBuilder
   */
  constructor(
    private _pulseConfigService: PulseConfigService,
    private _pulseMediaService: PulseMediaService,
    private _pulsePanelService: PulsePanelService,
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

  /**
   * Sets the folded property passed into the component rendering 
   * the panel in the folded/unfolded position and removes the padding 
   * of the sibling DOM node if folded. The sibling refers to the actual 
   * DOM node in reference from the component selector and excluding 
   * any ng-template or ng-container selectors.
   * 
   * @param {boolean} value : Passed in as an <@Input> and determines if 
   * the panel will be folded or unfolded. This only has an effect if the 
   * panel is locked open.
   */
  @Input() set folded(value: boolean) {
    // Set the folded
    this._folded = value;

    // Return if the panel if closed
    if (!this.opened) {
      return;
    }

    let sibling;
    let styleRule;

    const styleValue = this.foldedWidth + 'px';

    // Get the sibling and set the style rule
    if (this.position === 'left') {
      sibling = this._elementRef.nativeElement.nextElementSibling;
      styleRule = 'padding-left';
    } else {
      sibling = this._elementRef.nativeElement.previousElementSibling;
      styleRule = 'padding-right';
    }

    // If there is no sibling, return...
    if (!sibling) {
      return;
    }

    if (value) {
      this.fold();

      this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
      this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
      this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

      this._renderer.setStyle(sibling, styleRule, styleValue);
      this._renderer.addClass(this._elementRef.nativeElement, 'folded');
    } else {

      this.unfold();

      this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
      this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
      this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

      this._renderer.removeStyle(sibling, styleRule);
      this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
    }

    this.foldedChanged.emit(this.folded);
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

    // Register the panel
    this._pulsePanelService.register(this.name, this);

    // Setup visibility
    this._setupVisibility();

    // Setup position
    this._setupPosition();

    // Setup lockedOpen
    this._setupLockedOpen();

    // Setup folded
    this._setupFolded();
  }

  ngOnDestroy(): void {
    if (this.folded) {
      this.unfold();
    }

    // Unregister the sidebar
    this._pulsePanelService.unregister(this.name);

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

    // Make the panel invisible
    this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
  }

  private _setupPosition(): void {
    const position = this.position === 'right'
      ? constants.positionRt
      : constants.positionLt;

    this._renderer.addClass(this._elementRef.nativeElement, position);
  }

  private _setupLockedOpen(): void {
    if (!this.lockedOpen) {
      return;
    }

    // Set the wasActive for the first time
    this._wasActive = false;

    this._wasFolded = this.folded;

    this._showPanel();

    this._pulseMediaService.onMediaChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {

        /**
         * This flag will be true under two conditions:
         * 1. the lockedOpen <@Input> was passed in signaling there's a 
         *    media query being watched to set the panel to the locked 
         *    open position.
         * 2. the media query value from the lockedOpen ie., "gt-md" 
         *    matches the browsers current screen resolution triggering
         *    the Observable response. 
         */
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

          // Show the panel
          this._showPanel();

          // Force the the opened status to true
          this.opened = true;

          // Emit the 'openedChanged' event
          this.openedChanged.emit(this.opened);

          // If the panel was folded, forcefully fold it again
          if (this._wasFolded) {
            this._enableAnimations();

            this.folded = true;

            this._changeDetectorRef.markForCheck();
          }

          // Hide the backdrop if any exists
          this._hideBackdrop();
        } else {

          this.isLockedOpen = false;

          this.opened = false;

          this.openedChanged.emit(this.opened);

          this._hidePanel();
        }

        // Store the new active status
        this._wasActive = isActive;
      });
  }

  private _setupFolded(): void {

    // Return, if panel is not folded
    if (!this.folded) {
      return;
    }

    // Return if the panel is closed
    if (!this.opened) {
      return;
    }
  }

  private _showPanel() {
    this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

    this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

    this._changeDetectorRef.markForCheck();
  }

  private _hidePanel(isDelayed = true): void {
    const delay = isDelayed ? 300 : 0;

    setTimeout(() => {
      this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

      this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    }, delay);

    this._changeDetectorRef.markForCheck();
  }

  private _showBackdrop(): void {
    this._backdrop = this._renderer.createElement('div');

    this._backdrop.classList.add('pulse-panel-overlay');

    if (this.invisibleOverlay) {
      this._backdrop.classList.add('pulse-panel-overlay-invisible');
    }

    this._renderer.appendChild(this._elementRef.nativeElement.parentElement, this._backdrop);

    // Create the enter animation and attach it to the player
    this._player =
      this._animationBuilder
        .build([animate('300ms ease', style({ opacity: 1 }))])
        .create(this._backdrop);

    // Play the animation
    this._player.play();

    this._backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  private _hideBackdrop(): void {
    if (!this._backdrop) {
      return;
    }

    this._player =
      this._animationBuilder
        .build([animate('300ms ease', style({ opacity: 0 }))])
        .create(this._backdrop);

    // Play the animation
    this._player.play();

    this._player.onDone(() => {
      // remove backdrop listener

      this._backdrop.parentNode.removeChild(this._backdrop);
      this._backdrop = null;
    });

    // Mark for check
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

  public foldTemporarily(): void {
    // Only work if the panel is folded
    if (!this.folded) {
      return;
    }

    this._enableAnimations();

    // Fold the panel back
    this.unfolded = false;

    // Set the folded width
    const styleValue = this.foldedWidth + 'px';

    this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
    this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
    this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  public unfoldTemporarily(): void {
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

  public fold(): void {
    if (this.folded) {
      return;
    }

    this._enableAnimations();

    this.folded = true;

    this._changeDetectorRef.markForCheck();
  }

  public unfold(): void {
    if (!this.folded) {
      return;
    }

    this._enableAnimations();

    this.folded = false;

    this._changeDetectorRef.markForCheck();
  }

  public toggleFold(): void {
    if (this.folded) {
      this.unfold();
    }
    else {
      this.fold();
    }
  }

  public open(): void {
    if (this.opened || this.isLockedOpen) {
      return;
    }

    this._enableAnimations();

    this._showPanel();

    this._showBackdrop();

    this.opened = true;

    this.openedChanged.emit(this.opened);

    this._changeDetectorRef.markForCheck();
  }

  public close(): void {
    if (!this.opened || this.isLockedOpen) {
      return;
    }

    this._enableAnimations();

    this._hideBackdrop();

    this.opened = false;

    this.openedChanged.emit(this.opened);

    this._hidePanel();

    this._changeDetectorRef.markForCheck();
  }

  public toggleOpen(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
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
}
