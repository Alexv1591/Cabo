import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameRoomModule } from './game-room/game-room.module';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    GameRoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
