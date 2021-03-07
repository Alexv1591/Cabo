import { Component, OnInit } from '@angular/core';
import { RoomService } from './services/room.service';

@Component({
  selector: 'game-room',
  template: `
              <ng-container *ngIf="flag; else loading">
                <app-board></app-board>
                <app-chat></app-chat>
              </ng-container>
              <ng-template #loading>
                <div class="loader">
                  <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </ng-template>
  `,
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private i: number = 0;
  flag: boolean = false;
  constructor(private room_service: RoomService) { }

  ngOnInit(): void {
    this.room_service.createClient();
    this.joinOrCreateRoom();

  }

  private async joinOrCreateRoom() {
    let room;
    if(history.state.data)
      room = await this.room_service.joinOrCreate({ players: history.state.data.pc, AI: history.state.data.bc });
    else 
      room=await this.room_service.joinOrCreate();
    if(this.room_service.room)
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