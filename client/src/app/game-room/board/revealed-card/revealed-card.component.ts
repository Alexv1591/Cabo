import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-revealed-card',
  template: `<img [@slideStatus]="status" src={{path}} [style.top.px]="top" [style.left.px]="left">`,
  styleUrls: ['./revealed-card.component.scss'],
  animations: [
    trigger('slideStatus', [
      state('in', style({
        overflow: 'hidden',
        height: '*',
        width: '*'
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('in => out', animate('200ms ease')),
      transition('out => in', animate('300ms ease')),
      //transition('out => out', animate('0ms')),
    ])
  ]
})
export class RevealedCardComponent implements OnInit {

  status: 'in' | 'out' = 'out';

  @Input('data') data: any;
  path:any;
  top:any;
  left:any;

  constructor( ) { }

  public toggleStatus(){
    this.status = this.status=='in' ? 'out' : 'in';
  }

  ngOnInit(): void {
    this.path = this.data.path;
    this.top = this.data.top;
    this.left = this.data.left;
  }

}
