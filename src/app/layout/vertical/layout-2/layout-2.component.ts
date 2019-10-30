import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService } from '@pulse/services/config.service';

@Component({
  selector: 'vertical-layout-2',
  styleUrls: ['./layout-2.component.scss'],
  templateUrl: './layout-2.component.html'
})

export class VerticalLayout2Component implements OnInit, OnDestroy {
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
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._pulseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.config = config;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
