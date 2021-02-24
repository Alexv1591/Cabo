import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { RouterModule, Routes } from '@angular/router';
import { GameRoomModule } from './game-room/game-room.module';

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
