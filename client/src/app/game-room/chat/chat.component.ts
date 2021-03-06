import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  template:`<chat-messages></chat-messages>
            <chat-add-message></chat-add-message>`,
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
