import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoomRoutingModule } from './game-room-routing.module';
import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { GameRoomComponent } from './game-room.component';
import { PlayerComponent } from './board/player/player.component';
import { CardComponent } from './board/card/card.component';
import { PackComponent } from './board/pack/pack.component';
import { DiscardComponent } from './board/discard/discard.component';


@NgModule({
  declarations: [
    BoardComponent,
    ChatComponent,
    GameRoomComponent,
    PlayerComponent,
    CardComponent,
    PackComponent,
    DiscardComponent
  ],
  imports: [
    CommonModule,
    GameRoomRoutingModule
  ],
  exports: [
    GameRoomComponent
  ],
  entryComponents: [PlayerComponent, CardComponent]
})
export class GameRoomModule { }
