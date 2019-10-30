import { Component, Input, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';

// Temporary 
import { PulsePanelService } from '@pulse/components/panel';

@Component({
  selector: 'navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None
})

export class NavbarComponent {
  private _variant: string;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _pulsePanelService: PulsePanelService
  ) {

    /**
     * Default variant is vertical-style-1 and can be overridden by 
     * passing a value into the component input set accessor.
     */
    this._variant = 'vertical-style-1';
  }

  /**
   * ===========================
   * Accessors
   * ===========================
   */

  get variant(): string {
    return this._variant;
  }

  @Input()
  set variant(value: string) {
    this._renderer.removeClass(this._elementRef.nativeElement, this.variant);

    this._variant = value;

    this._renderer.addClass(this._elementRef.nativeElement, this._variant);
  }

  // Temp
  public togglePanelFolded() {
    this._pulsePanelService.getPanel('navbar').toggleFold();
  }
}
