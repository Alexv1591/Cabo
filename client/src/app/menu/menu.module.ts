import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';


@NgModule({
  declarations: [
    MenuComponent,
    NewGameComponent,
    HowToPlayComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
