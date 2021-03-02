import { Component, OnInit } from '@angular/core';
import { Room } from 'colyseus.js';
import { RoomService } from './services/room.service';

@Component({
  selector: 'game-room',
  template: `
              <ng-container *ngIf="flag; else loading"><app-board></app-board></ng-container>
              <ng-template #loading>Loading</ng-template>
              <app-chat></app-chat>
  `,
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private i: number = 0;
  flag: boolean = false;
  constructor(private room_service: RoomService) { }

  ngOnInit(): void {
    this.room_service.createClient();
    this.createRoom();
  }

  private async createRoom() {
    let room:Room;
    if (history.state.data.create) {
      let pc = history.state.data.pc,
          bc = history.state.data.bc;
      room = await this.room_service.joinOrCreate({ players: pc, AI: bc });
    }
    else
      room = await this.room_service.joinOrCreate();
    this.loadMassages();
  }

  private async loadMassages() {
    this.room_service.room.onMessage("game-start", (message) => {
      console.log("game-start")
      this.flag = true;
    });
    this.room_service.room.onMessage("my-turn", (message) => {
      this.playerTurn();
    });
    this.room_service.room.onMessage("GameOver", (message) => {
      console.log("GameOver");
    });

  }

  private async playerTurn() {
    console.log("it's my turn");


    //this.room_service.nextTurn();
  }
}