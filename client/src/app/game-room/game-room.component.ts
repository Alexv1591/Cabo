import { Component, OnInit } from '@angular/core';
import { RoomService } from './services/room.service';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  constructor(private room_service: RoomService) { }

  ngOnInit(): void {
    this.room_service.createClient();
    this.createRoom();
  }

  private async createRoom() {
    let room = await this.room_service.joinRoom();
    this.loadMassages();
  }

  private async loadMassages() {
    this.room_service.room.onMessage("my-turn", (message) => {
      this.playerTurn();
    });
    this.room_service.room.onMessage("GameOver", (message) => {
      console.log("GameOver");
    });
  }

  private async playerTurn(){
    console.log("it's my turn");
    let a:any;
    a=await this.room_service.drawCard();
    console.log(this.room_service.room.sessionId+" draw "+a);
    this.room_service.nextTurn(); 
  }
}