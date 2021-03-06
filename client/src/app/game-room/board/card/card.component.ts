import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<img [@glowStatus]="status" *ngIf="!empty" src="assets/Cards/Back.png" [style.animation]="glowStyle">`,
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

  @Input('empty') empty:boolean;

  glowStyle: string = 'none';

  status: 'in' | 'out' = 'out';

  public setGlow( color: string ){
    switch (color) {
      case 'green':
        this.glowStyle = "glow-green 1s ease-in-out infinite alternate";
        break;
      case 'yellow':
        this.glowStyle = "glow-yellow 1s ease-in-out infinite alternate";
        break;
      case 'orange':
        this.glowStyle = "glow-orange 1s ease-in-out infinite alternate";
        break;
      case 'none':
        this.glowStyle = "none";
        break;
      default:
        throw "Card can't set glow -- invalid value provided"
    }
  }

  constructor(private elRef:ElementRef) { }

  ngOnInit(): void { }

  get isEmpty():boolean{
    return this.empty;
  }

}
