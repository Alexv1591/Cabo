import { Component, OnInit } from '@angular/core';
import { Client } from 'colyseus.js';

@Component({
  selector: 'game-room',
  template: `
              <app-board></app-board>
              <app-chat></app-chat>
  `,
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
