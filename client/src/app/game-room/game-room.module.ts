import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoomRoutingModule } from './game-room-routing.module';
import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { GameRoomComponent } from './game-room.component';
import { PlayerComponent } from './board/player/player.component';


@NgModule({
  declarations: [
    BoardComponent,
    ChatComponent,
    GameRoomComponent,
    PlayerComponent
  ],
  imports: [
    CommonModule,
    GameRoomRoutingModule
  ],
  exports: [
    GameRoomComponent
  ],
  entryComponents: [PlayerComponent]
})
export class GameRoomModule { }
