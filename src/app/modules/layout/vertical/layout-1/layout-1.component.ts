import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService } from '@pulse/services/config.service';

@Component({
  selector: 'vertical-layout-1',
  styleUrls: ['./layout-1.component.scss'],
  templateUrl: './layout-1.component.html'
})

export class VerticalLayout1Component implements OnInit, OnDestroy {
  // Public
  public config: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PulseConfigService} _pulseConfigService
   */
  constructor(private _pulseConfigService: PulseConfigService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._pulseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.config = config;

        console.log(this.config.layout.style);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
