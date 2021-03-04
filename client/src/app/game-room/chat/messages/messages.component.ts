import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Room } from 'colyseus.js';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'chat-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit ,AfterViewInit {

  constructor(private room_service:RoomService)  { }
  public messages:any[]=new Array<any>();
  private room:Room
  ngOnInit(): void {
    this.room_service.messages.subscribe((message)=>this.messages=message);  
  }
  ngAfterViewInit(){

  }

}
