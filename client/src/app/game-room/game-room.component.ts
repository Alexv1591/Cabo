import { Component, OnInit } from '@angular/core';
import { Client } from 'colyseus.js';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const client=new Client('ws://localhost:3000')
    // try {
    //   const room =client.joinOrCreate("my_room", {/* options */});
    //   console.log("joined successfully", room);
    
    // } catch (e) {
    //   console.error("join error", e);
    // }
  }

}
