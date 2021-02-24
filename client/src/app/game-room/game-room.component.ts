import { Component, OnInit } from '@angular/core';
import { Client, Room } from 'colyseus.js';


@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private room:Room;
  constructor() { 
    //this.createClient();
  }

  ngOnInit(): void {
    this.createClient();
  }
    
  private async createClient(){
    const client= new Client('ws://localhost:3000')
    let i=0;
    try {
      this.room= await client.joinOrCreate("cabo_room", {players:2,AI:0});//.then((room:Room)=>{console.log("joined successfully to "+room.id);});
      
      this.room.onMessage("my-turn",(message) => {
        i++;
        console.log("it's my turn "+i);
          this.room.send("nextTurn",{});
      });
      this.room.onMessage("GameOver",(message)=>{
        console.log("GameOver");
      });
    
    } catch (e) {
      console.error("join error", e);
    }
  }


}