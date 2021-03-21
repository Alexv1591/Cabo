import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<img [@floatStatus]="status" *ngIf="!empty" src={{src}} [style.animation]="glowStyle">`,
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('floatStatus', [
      state('none', style({
        overflow: 'hidden',
        height: '*',
        width: '*'
      })),
      state('float', style({
        transform: 'scale(1.2,1.2)',
        boxShadow: '0 14px 9px -9px #777'
      })),
      state('hide', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px'
      })),
      state('fly', style({
        opacity: '0',
        overflow: 'hidden',
        transform: 'translateY(-200px)',
        width: '50px'
      })),
      transition('none => hide', animate('0ms')),
      transition('* => *', animate('500ms ease'))
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input('empty') empty: boolean;

  glowStyle: string = 'none';

  status: 'none' | 'float' | 'hide' | 'fly' = 'none';

  src: string = "assets/Cards/Back.png";

  public setGlow(color: string) {
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
      case 'red':
        this.glowStyle = "glow-red 1s ease-in-out infinite alternate";
        break;
      case 'none':
        this.glowStyle = "none";
        break;
      default:
        throw "Card can't setGlow, invalid value provided -- '" + color + "'";
    }
  }

  public toggleHide(bool: boolean) { this.status = bool == true ? 'hide' : 'none'; }

  public toggleFloat() {
    this.status = 'float';
    setTimeout(() => { this.status = 'none'; }, 2000);
  }

  public toggleFly() {
    this.status = 'fly';
    setTimeout(() => { this.status = 'none'; }, 1000);
  }

  public GameOverChangePic(path: any) {
    this.toggleHide(true);
    setTimeout(() => {
      this.src = path;
      this.toggleHide(false);
    }, 200);
  }

  constructor() { }

  ngOnInit(): void { }

  get isEmpty(): boolean {
    return this.empty;
  }

}
