import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoomRoutingModule } from './gameroom-routing.module';
import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { GameRoomComponent } from './game-room.component';


@NgModule({
  declarations: [
    BoardComponent,
    ChatComponent,
    GameRoomComponent
  ],
  imports: [
    CommonModule,
    GameRoomRoutingModule
  ],
  exports: [
    GameRoomComponent
  ]
})
export class GameRoomModule { }
