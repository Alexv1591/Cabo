import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pack',
  template: `<img (click)="click()" src="assets/Cards/Back.png" [style.animation]="isDrawable? glowStyle : 'none'">`,
  // template: `<img [@glowStatus]="status" (@glowStatus.done)="onEnd($event)" (click)="click('draw')" src="assets/Cards/Back.png">`,
  styleUrls: ['./pack.component.scss']
})
export class PackComponent implements OnInit {
  
  glowStyle = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these

  constructor( private host:ElementRef ) { }

  @Input() isDrawable: boolean;
  @Output() public draw:EventEmitter<any> = new EventEmitter();

  click(): void {
    if( this.isDrawable )
      this.draw.emit();
  }

  ngOnInit(): void {
  }

}
