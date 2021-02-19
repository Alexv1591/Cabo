import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameRoomModule } from 'src/game-room/gameroom.module';

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
