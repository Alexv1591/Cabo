import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
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
      transition('in => out', animate('200ms')),
      transition('out => in', animate('200ms'))
    ])
  ]
})
export class MainMenuComponent implements OnInit {
  
  status: 'in' | 'out';

  constructor() { }

  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  buttonClick(buttonClicked:string): void {
    this.status = 'out';
    setTimeout( () => {
      this.choice.next( buttonClicked );
    }, 200);
  }

  ngOnInit(): void {
    this.status = 'out';
    setTimeout( () => {
      this.status = 'in';
    }, 100);
  }

}
