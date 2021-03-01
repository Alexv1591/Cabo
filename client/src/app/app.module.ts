import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameRoomModule } from './game-room/game-room.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameRoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
