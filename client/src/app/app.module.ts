import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameRoomModule } from './game-room/game-room.module';
import { MenuModule } from './menu/menu.module';
import { AlertModule } from './_alert';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    GameRoomModule,
    MenuModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
