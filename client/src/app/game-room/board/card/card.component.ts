import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<img [@floatStatus]="status" *ngIf="!empty" src="assets/Cards/Back.png" [style.animation]="glowStyle">`,
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('floatStatus', [
      state('none', style({

      })),
      state('float', style({
        transform: 'scale(1.1,1.1)',
        boxShadow: '0 10px 6px -6px #777'
      })),
      state('hide', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('none => hide', animate('0ms')),
      transition('* => *', animate('500ms ease'))
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input('empty') empty:boolean;

  glowStyle: string = 'none';

  status: 'none' | 'float' | 'hide' = 'none';

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
        throw "Card can't set glow, invalid value provided -- '" + color + "'";
    }
  }

  public toggleHide(){
    console.log("toggling card status");
    this.status = 'hide';
    setTimeout( () => {
      this.status='none';
    }, 2000);
  }

  public toggleFloat(){
    console.log("toggling card status");
    this.status = 'float';
    setTimeout( () => {
      this.status='none';
    }, 2000);
  }

  constructor() { }

  ngOnInit(): void { }

  get isEmpty():boolean{
    return this.empty;
  }

}
