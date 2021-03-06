import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Room } from 'colyseus.js';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'chat-messages',
  template: `<div class="messages">
                  <span *ngFor='let message of messages'>
                    <chat-message [data]='message'></chat-message>
                  </span>
                </div>`,
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private room_service:RoomService)  { }
  public messages:any[]=new Array<any>();
  private room:Room
  ngOnInit(): void {
    this.room_service.messages.subscribe((message)=>this.messages=message);  
  }

}
