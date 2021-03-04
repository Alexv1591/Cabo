import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<img [@glowStatus]="status" *ngIf="!empty" src="assets/Cards/Back.png" [style.animation]="isReplacable? style : 'none'">`,
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('glowStatus', [
      state('in', style({
      })),
      state('out', style({
      })),
      transition('* => *', animate('300ms ease'))
    ])
  ]
})
export class CardComponent implements OnInit {

  style = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these

  isReplacable: boolean = false;

  status: 'in' | 'out' = 'out';

  @Input('empty') empty:boolean;

  constructor(private elRef:ElementRef) { }

  ngOnInit(): void { }

  get isEmpty():boolean{
    return this.empty;
  }

}
