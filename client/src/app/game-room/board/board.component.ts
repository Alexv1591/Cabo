import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomService } from '../services/room.service';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild( 'container', {read: ViewContainerRef} ) container: ViewContainerRef;
  
  private player_count: number;
  private placement_angles: number[];
  roundStart: boolean = false;

  constructor(private resolver: ComponentFactoryResolver, private host:ElementRef, private room_service: RoomService) {
    console.log( history.state.data );
    console.log( history.state.data.pc+history.state.data.bc );
    this.placement_angles = new Array<number>();
    this.player_count = room_service.players.length;
  }

  private setup(num_of_players: number, radius: number) {
    let mainHeight: number = this.host.nativeElement.offsetHeight;
    let mainWidth: number = this.host.nativeElement.offsetWidth;
    for (var i = 0; i < num_of_players; i++) {
      let data:string[];
      let initX:number = Math.round(radius * (Math.cos(this.placement_angles[i]))),
          initY:number = Math.round(radius * (Math.sin(this.placement_angles[i])));
      let topp:string = (((mainHeight / 2) - initX - 100 )/mainHeight*100).toPrecision(4) + '%',
          leftp:string = (((mainWidth / 2)*.7 + initY)/mainWidth*70).toPrecision(4) + '%',
          rotation:string = "rotate(" + ( i * (360 / num_of_players)) + "deg)";
      data = [topp,leftp,rotation,this.room_service.players[i]];
      const componentFactory = this.resolver.resolveComponentFactory(PlayerComponent);
      let playerRef = this.container.createComponent(componentFactory);
      playerRef.instance.data = data;
    }
  };

  private generate(num_of_players: number, radius: number) {
    radius = radius*0.7;
    let frags: number = 360 / num_of_players;
    for (var i = 0; i < num_of_players; i++) {
      this.placement_angles.push((frags / 180) * i * Math.PI + Math.PI );
    }
    this.setup(num_of_players, radius);
  }

  ngOnInit(): void { 
    this.loadMassages();
  }

  ngAfterViewInit():void {
    setTimeout( () => {
      this.generate(this.player_count, Math.round(this.host.nativeElement.offsetHeight * 0.5));
    }, 0);
  }

  receiveMessage($event): void {
    this.roundStart = false;
    let msg = $event;
    console.log(msg);
    if( msg=='draw' ){
      this.newCard();
    }
  }

  private async newCard(){
    let tmp = await this.room_service.drawCard();
    console.log( tmp );
  }
  
  private async loadMassages() {
    this.room_service.room.onMessage("my-turn", (message) => {
      this.roundStart = true;
    });
  }

}
