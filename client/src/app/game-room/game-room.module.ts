import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameRoomRoutingModule } from './game-room-routing.module';
import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { GameRoomComponent } from './game-room.component';
import { PlayerComponent } from './board/player/player.component';
import { CardComponent } from './board/card/card.component';

import { AddMessageComponent } from './chat/add-message/add-message.component'
import { MessageComponent } from './chat/message/message.component';
import { MessagesComponent } from './chat/messages/messages.component';
import { FormsModule } from '@angular/forms';
import { PackComponent } from './board/pack/pack.component';
import { DiscardComponent } from './board/discard/discard.component';
import { RevealedCardComponent } from './board/revealed-card/revealed-card.component';


@NgModule({
  declarations: [
    BoardComponent,
    ChatComponent,
    GameRoomComponent,
    PlayerComponent,
    CardComponent,
    PackComponent,
    DiscardComponent,
    RevealedCardComponent,
    AddMessageComponent,
    MessageComponent,
    MessagesComponent
  ],
  imports: [
    CommonModule,
    GameRoomRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  exports: [
    GameRoomComponent
  ],
  entryComponents: [PlayerComponent, CardComponent]
})
export class GameRoomModule { }
