import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomService } from '../services/room.service';
import { DiscardComponent } from './discard/discard.component';
import { PlayerComponent } from './player/player.component';
import { RevealedCardComponent } from './revealed-card/revealed-card.component';

enum Glow {
  draw = 'green',
  replace = 'green',
  remove = 'green',
  peek = 'yellow',
  swap = 'orange',
  //stick = 'red',
  none = 'none'
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, AfterViewInit {
  

  @ViewChild( 'container', {read: ViewContainerRef} ) container: ViewContainerRef;
  @ViewChild( 'discard' ) discardComponent: DiscardComponent;
  playerRefs: ComponentRef<PlayerComponent>[];
  private cardRef: ComponentRef<RevealedCardComponent>;


  @ViewChild( 'pack_discard', {read: ElementRef} ) pack_discardRef: ElementRef;
  @ViewChild( 'pack', {read: ElementRef} ) packRef: ElementRef;
  
  private player_count: number;
  private placement_angles: number[];
  roundStart: boolean = false;
  canDiscard: boolean = false;
  heldCard: any;

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
        console.log("dumpster-dive");
        break;

      case 'discard':
        this.discard();
        break;
    
      default:
        throw "board received invalid message";
        break;
    }

  }

  private startTurn(){
    this.roundStart = true;
    this.packGlow( Glow.draw );
  }

  private async newCard(){
    this.heldCard = await this.room_service.drawCard();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    this.cardRef = this.container.createComponent(componentFactory);
    this.cardRef.instance.data = { path:this.heldCard, top:topp, left:leftp };
    this.keepOrDiscard();
  }

  private keepOrDiscard(){
    this.playerGlow( Glow.replace );
    this.discardGlow( Glow.remove );
  }

  private resolveCard( card:string ){
    console.log( card );
    switch (card) {
      case '7':
      case '8':
        this.playerGlow( Glow.peek );
        break;
      case '9':
      case '10':
        this.opponentGlow( Glow.peek );
        break;
      case '11':
        this.playerGlow( Glow.swap );
        this.opponentGlow( Glow.swap );
        break;
      case '12':
        this.playerGlow( Glow.peek );
        this.opponentGlow( Glow.peek );
        break;
      default:
        break;
    }

  }

  private discard(){
    this.canDiscard = false;
    this.playerGlow( Glow.none );
    this.discardComponent.setTop( this.cardRef.instance.data.path );
    this.room_service.discardCard( this.cardRef.instance.data.path );
    this.resolveCard( this.trimPath(this.cardRef.instance.data.path) )

    //TO DO animation
    this.cardRef.destroy();
  }

  private trimPath( path: any ): string{
    let _pre = /-/gi;
    let _post = /.png/gi;
    let tmp = String(path);
    tmp = tmp.slice(-6);
    tmp = tmp.replace( _pre, "" );
    tmp = tmp.replace( _post, "" );
    return tmp;
  }

  private playerGlow( mode:string ){
    console.log("playerGlow(" + mode + ")")
    this.playerRefs[0].instance.setGlow( mode );
  }

  private opponentGlow( mode:string ){
    for (let i = 1; i < this.playerRefs.length; i++) {
      this.playerRefs[i].instance.setGlow( mode );
    }
  }

  private packGlow( mode:string ){

  }

  private discardGlow( mode:string ){
    this.canDiscard = true;
  }
  
  private async loadMassages() {
    this.room_service.room.onMessage("my-turn", (message) => {
      this.startTurn();
    });
  }

}
