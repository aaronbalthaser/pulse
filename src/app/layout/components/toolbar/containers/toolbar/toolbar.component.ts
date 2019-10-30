import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { PulsePanelService } from '@pulse/components/panel';

@Component({
  selector: 'toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _pulsePanelService: PulsePanelService
  ) { }

  public togglePanelOpen() {
    this._pulsePanelService.getPanel('navbar').toggleOpen();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
