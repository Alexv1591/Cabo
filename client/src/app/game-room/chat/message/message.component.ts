import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chat-message',
  template:`<div class="card bg-info text-white my-2">
              <h5>{{data.player}}</h5>
              <p>{{data.message}}</p>
            </div>`,
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() data:any;


  constructor() { }

  ngOnInit(): void {
  }

}
