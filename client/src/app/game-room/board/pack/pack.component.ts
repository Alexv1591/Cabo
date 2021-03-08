import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-pack',
  template: `<img [@floatStatus]="status" (click)="click()" src="assets/Cards/Back.png" [style.animation]="isDrawable? glowStyle : 'none'">`,
  // template: `<img [@glowStatus]="status" (@glowStatus.done)="onEnd($event)" (click)="click('draw')" src="assets/Cards/Back.png">`,
  styleUrls: ['./pack.component.scss'],
  animations: [
    trigger('floatStatus', [
      state('none', style({

      })),
      state('float', style({
        transform: 'scale(2,2)',
        boxShadow: '0 10px 6px -6px #777'
      })),
      transition('none => float', animate('800ms ease')),
      transition('float => none', animate('400ms ease'))
    ])
  ]
})
export class PackComponent implements OnInit {
  
  glowStyle = "glow-green 1s ease-in-out infinite alternate"; //TO DO a separate file to store these
  
  status: 'none' | 'float' = 'none';

  constructor( private room_service: RoomService ) { }

  @Input() isDrawable: boolean;
  @Output() public draw:EventEmitter<any> = new EventEmitter();

  click(): void {
    if( this.isDrawable )
      this.draw.emit();
  }

  private toggleStatus(){
    this.status = 'float';
    console.log("toggling pack status to " + this.status);
    setTimeout( () => {
      this.status='none';
      console.log("toggling pack status to " + this.status);
    }, 3000);
  }

  ngOnInit(): void { this.loadMassages(); }
  
  private async loadMassages() {
    this.room_service.room.onMessage("player-draw-card", (message) => {
      this.toggleStatus();
    });
  }

}
