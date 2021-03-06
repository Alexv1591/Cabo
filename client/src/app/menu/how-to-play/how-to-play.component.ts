import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss'],
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
        height: '200px',
        width: '120px'
      })),
      transition('in => out', animate('150ms ease-in-out')),
      transition('* => in', animate('150ms ease-in-out'))
    ])
  ]
})
export class HowToPlayComponent implements OnInit {

  status: 'in' | 'out' = 'out';
  
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    setTimeout( () => {
      this.status = 'in';
    }, 0);
  }

  back(buttonClicked:string): void {
    this.status = 'out';
    setTimeout( () => {
      this.choice.next( buttonClicked );
    }, 200);
  }

}
