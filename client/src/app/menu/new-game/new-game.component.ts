import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  playerCount: number = 0;
  botCount: number = 0;

  constructor( private router: Router) { }

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

  startGlow(): void {}

  startClicked(): void {
    if( this.playerCount + this.botCount > 0){
      let pc = this.playerCount + 1;
      let bc = this.botCount;
      let create = true;
      this.router.navigate( ['/game-room'], {state: {data: { create, pc, bc }}});
    }
  }

}
