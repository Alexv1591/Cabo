import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  playerCount: number = 0;
  botCount: number = 0;

  constructor() { }

  ngOnInit(): void { }

  back(buttonClicked:string): void {
    this.choice.next( buttonClicked );
  }

  playerClicked( click: string ): void {
    this.playerCount += Number(click);
    if( this.playerCount+this.botCount>4 )
      this.playerCount -= 1;
    if( this.playerCount==-1 )
      this.playerCount = 0;
  }

  botClicked( click: string ): void {
    this.botCount += Number(click);
    if( this.playerCount+this.botCount>4 )
      this.botCount -= 1;
    if( this.botCount==-1 )
      this.botCount = 0;
  }

  startClicked(): void {

  }

}
