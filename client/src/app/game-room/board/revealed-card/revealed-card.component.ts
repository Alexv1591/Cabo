import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-revealed-card',
  template: `<img [@showStatus]="status" src={{path}} [style.top.px]="top" [style.left.px]="left">`,
  styleUrls: ['./revealed-card.component.scss'],
  animations: [
    trigger('showStatus', [
      state('show', style({
        overflow: 'hidden',
        height: '*',
        width: '*'
      })),
      state('hide', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px'
      })),
      transition('show => hide', animate('200ms ease')),
      transition('hide => show', animate('300ms ease')),
      transition('hide => hide', animate('0ms')),
    ])
  ]
})
export class RevealedCardComponent implements OnInit {

  status: 'show' | 'hide' = 'hide';

  @Input('data') data: any;
  path:any;
  top:any;
  left:any;

  constructor( ) { }

  public toggleStatus(time:number){
    setTimeout(() => {
      this.status = this.status=='show' ? 'hide' : 'show';
    }, time);
  }

  ngOnInit(): void {
    this.path = this.data.path;
    this.top = this.data.top;
    this.left = this.data.left;
  }

}
