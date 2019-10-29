import { Component } from '@angular/core';

import { PulsePanelService } from '@pulse/components/panel';

@Component({
  selector: 'toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})

export class ToolbarComponent {
  constructor(private _pulsePanelService: PulsePanelService) { }

  public togglePanelOpen() {
    this._pulsePanelService.getPanel('navbar').toggleOpen();
  }
}
