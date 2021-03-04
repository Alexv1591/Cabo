import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomService } from '../services/room.service';
import { PlayerComponent } from './player/player.component';
import { RevealedCardComponent } from './revealed-card/revealed-card.component';

enum Glow {
  draw = 'green',
  replace = 'green',
  swap = 'yellow',
  stick = 'orange',
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, AfterViewInit {
  

  @ViewChild( 'container', {read: ViewContainerRef} ) container: ViewContainerRef;
  @ViewChild( 'pack_discard', {read: ElementRef} ) pack_discardRef: ElementRef;
  @ViewChild( 'discard', {read: ElementRef} ) discardRef: ElementRef;
  @ViewChild( 'pack', {read: ElementRef} ) packRef: ElementRef;
  playerRefs: ComponentRef<PlayerComponent>[];
  private cardRef: ComponentRef<RevealedCardComponent>;
  
  private player_count: number;
  private placement_angles: number[];
  roundStart: boolean = false;

  constructor(private resolver: ComponentFactoryResolver, private host:ElementRef, private room_service: RoomService) {
    // console.log( history.state.data );
    this.placement_angles = new Array<number>();
    this.player_count = room_service.players.length;
    this.playerRefs = new Array<ComponentRef<PlayerComponent>>();
  }

  private setup(num_of_players: number, radius: number) {
    let mainHeight: number = this.host.nativeElement.offsetHeight;
    let mainWidth: number = this.host.nativeElement.offsetWidth;
    for (var i = 0; i < num_of_players; i++) {
      let initX:number = Math.round(radius * (Math.cos(this.placement_angles[i]))),
          initY:number = Math.round(radius * (Math.sin(this.placement_angles[i])));
      let topp:string = (((mainHeight / 2) - initX - 100 )/mainHeight*100).toPrecision(4) + '%',
          leftp:string = (((mainWidth / 2)*.7 + initY)/mainWidth*70).toPrecision(4) + '%',
          rotatestr:string = "rotate(" + ( i * (360 / num_of_players)) + "deg)";
      let data = { top:topp, left:leftp, rotation:rotatestr, id:this.room_service.players[i] };
      const componentFactory = this.resolver.resolveComponentFactory(PlayerComponent);
      let playerRef = this.container.createComponent(componentFactory);
      this.playerRefs.push(playerRef);
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
    let msg = $event[0];
    switch (msg) {
      case 'draw':
        this.newCard();
        break;

      case 'dumpster-dive':
        break;

      case 'discard':
        
        break;
    
      default:
        break;
    }

  }

  private async newCard(){
    let tmp = await this.room_service.drawCard();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    this.cardRef = this.container.createComponent(componentFactory);
    this.cardRef.instance.data = { path:tmp, top:topp, left:leftp };
    this.playerGlow( Glow.replace );
    this.keepOrDiscard();
  }

  private keepOrDiscard(){
    
  }

  private playerGlow( mode:string ){
    console.log("playerGlow(" + mode + ")")
    this.playerRefs[0].instance.setGlow( mode );
  }

  private opponentGlow( mode:string ){
    for (let i = 1; i < this.playerRefs.length; i++) {
      this.playerRefs[0].instance.setGlow( mode );
    }
  }

  private packGlow( mode:string ){

  }

  private discardGlow( mode:string ){

  }
  
  private async loadMassages() {
    this.room_service.room.onMessage("my-turn", (message) => {
      this.roundStart = true;
      this.packGlow( Glow.draw );
    });
  }

}
