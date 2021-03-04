import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-discard',
  template: ` <div style="width: 60px; height: 90px; border: 2px solid black; border-radius: 4px;" (click)="buttonClick()" [style.animation]="isDrawable&&counter>0||isDiscardable ? glowStyle : 'none'">
                <img *ngIf="counter>1" [src]="bottomCard" style="postion: absolute; z-index: 1;">
                <img *ngIf="counter>0" (click)="buttonClick()" [src]="topCard" style="postion: absolute; z-index: 2;">
              </div>`,
  styleUrls: ['./discard.component.scss']
})
export class DiscardComponent implements OnInit {
  
  glowStyle = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these
  topCard = "";
  bottomCard = "";
  counter:number = 0;

  constructor() {}
  
  @Input() isDrawable: boolean;
  @Input() isDiscardable: boolean;
  @Output() public choice:EventEmitter<string[]> = new EventEmitter();

  public setTop( path:any ){
    this.counter++;
    if( this.topCard != "" )
      this.bottomCard = this.topCard;
    this.topCard = path;
    console.log( "top card is " + this.topCard + '\n' + "bottom card is " + this.bottomCard )
  }

  buttonClick(): void {
    //console.log( buttonClicked );
    if( this.isDrawable )
      this.choice.emit( ["dumpster-dive"] );
    if( this.isDiscardable )
      this.choice.emit( ["discard"] );
  }

  ngOnInit(): void {
  }

}
