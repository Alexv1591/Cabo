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
      transition('* => *', animate('150ms ease-in-out')),
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

  ngOnInit(): void {
    //console.log( this.data );
    this.path = this.data.path;
    this.top = this.data.top;
    this.left = this.data.left;
    this.status = 'in';
  }

}
