import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'chat-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
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
