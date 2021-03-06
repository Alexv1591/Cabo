import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'chat-add-message',
  templateUrl: './add-message.component.html',
  styles: [':host { padding-right:2%; display: block;}']
})
export class AddMessageComponent implements OnInit {
  input:string;
  constructor(private room_service:RoomService) { }

  ngOnInit(): void { }

  send(){
    this.room_service.sendChatMessage(this.input);
    this.input="";
  }

}
