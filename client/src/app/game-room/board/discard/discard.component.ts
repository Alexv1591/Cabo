import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-discard',
  template: `<img (click)="buttonClick()" src="assets/Cards/CLUB-1.png" [style.animation]="isDrawable? style : 'none'">`,
  styleUrls: ['./discard.component.scss']
})
export class DiscardComponent implements OnInit {
  
  style = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these

  constructor() { }
  
  @Input() isDrawable: boolean;
  @Input() isDiscardable: boolean;
  @Output() public choice:EventEmitter<string[]> = new EventEmitter();

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
