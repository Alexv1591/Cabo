import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-discard',
  template: ` <div style="width: 60px; height: 90px; border: 2px solid black; border-radius: 4px;" (click)="click()" [style.animation]="isDrawable&&counter>0||isDiscardable ? glowStyle : 'none'">
                <img *ngIf="counter>1" [src]="bottomCard" style="postion: absolute; z-index: 1;">
                <img *ngIf="counter>0" (click)="click()" [src]="topCard" style="postion: absolute; z-index: 2;">
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
  @Output() public dive:EventEmitter<any> = new EventEmitter();
  @Output() public discard:EventEmitter<any> = new EventEmitter();

  public setTop( path:any ){//TO DO fix positions
    this.counter++;
    if( this.topCard != "" )
      this.bottomCard = this.topCard;
    this.topCard = path;
    console.log( "top card is " + this.topCard + '\n' + "bottom card is " + this.bottomCard )
  }

  public getTop(){
    let tmp = this.topCard;
    this.topCard = this.bottomCard;
    return tmp;
  }

  click(): void {
    //console.log( buttonClicked );
    if( this.isDrawable && this.counter>0 )
      this.dive.emit();
    if( this.isDiscardable )
      this.discard.emit();
  }

  ngOnInit(): void {
  }

}
