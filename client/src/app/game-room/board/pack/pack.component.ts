import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pack',
  template: `<img [@glowStatus]="status" (click)="buttonClick('draw')" src="assets/Cards/Back.png" [style.animation]="isDrawable? style : 'none'">`,
  // template: `<img [@glowStatus]="status" (@glowStatus.done)="onEnd($event)" (click)="buttonClick('draw')" src="assets/Cards/Back.png">`,
  styleUrls: ['./pack.component.scss'],
  animations: [
    trigger('glowStatus', [
      state('none', style({
      })),
      state('green', style({
      })),
      state('yellow', style({
      })),
      state('orange', style({
      })),
      transition('* => green', animate('1s ease', keyframes([
        style({ boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px limegreen, 0 0 40px limegreen, 0 0 50px limegreen, 0 0 60px limegreen, 0 0 70px limegreen'
         }),
        style({ boxShadow: '0 0 20px #fff, 0 0 30px green, 0 0 40px green, 0 0 50px green, 0 0 60px green, 0 0 70px green, 0 0 80px green'
         })
      ]))),
      transition('* => none', animate('100ms ease') )
    ])
  ]
})
export class PackComponent implements OnInit {
  
  status: 'green' | 'yellow' | 'orange' | 'none' = 'none';
  style = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these

  constructor( private host:ElementRef ) { }

  @Input() isDrawable: boolean;
  @Output() public choice:EventEmitter<string[]> = new EventEmitter();

  buttonClick(buttonClicked:string): void {
    if( this.isDrawable ){
      //status = 'green';
      this.style = "none";
      this.choice.emit( [buttonClicked, this.host.nativeElement.offsetTop, this.host.nativeElement.offsetLeft] );
    }
  }

  onEnd( event ){
    console.log(status);
    status = 'none';
    if( this.isDrawable ){
      console.log(status);
      setTimeout(() => { status = 'green'; console.log(status) }, 1000);
    }
  }

  ngOnInit(): void {
    // if( this.isDrawable )
      setTimeout(() => { status = 'green'; }, 1000);
  }

}
