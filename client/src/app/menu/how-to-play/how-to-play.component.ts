import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  back(buttonClicked:string): void {
    this.choice.next( buttonClicked );
  }

}
