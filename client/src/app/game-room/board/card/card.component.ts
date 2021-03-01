import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input('empty') empty:boolean;

  constructor(private elRef:ElementRef) { }

  ngOnInit(): void { }

  get isEmpty():boolean{
    return this.empty;
  }

}
