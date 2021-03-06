import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PulseConfigService } from '@pulse/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  // Public 
  public config: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   * 
   * @param {DOCUMENT} document
   * @param {PulseConfigService} _pulseConfigService
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _pulseConfigService: PulseConfigService
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._pulseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        // set initial application configurations
        this.config = config;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
