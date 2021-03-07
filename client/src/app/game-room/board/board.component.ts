import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomService } from '../services/room.service';
import { DiscardComponent } from './discard/discard.component';
import { PlayerComponent } from './player/player.component';
import { RevealedCardComponent } from './revealed-card/revealed-card.component';
import * as states from './../../../../../server/lib/TurnStates'

enum Glow {
  draw = 'green',
  keep = 'lightgreen',
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


  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('discard') discardComponent: DiscardComponent;
  playerRefs: ComponentRef<PlayerComponent>[];
  private cardRef: ComponentRef<RevealedCardComponent>;

  @ViewChild('pack_discard', { read: ElementRef }) pack_discardRef: ElementRef;
  @ViewChild('pack', { read: ElementRef }) packRef: ElementRef; //not used

  private player_count: number;
  private placement_angles: number[];
  roundStart: boolean = false;
  canDiscard: boolean = false;
  private goAgain: boolean = false;
  private swapString: string = "";

  private state: any;

  constructor(private resolver: ComponentFactoryResolver, private host: ElementRef, private room_service: RoomService) {
    this.placement_angles = new Array<number>();
    this.player_count = room_service.players.length;
    this.playerRefs = new Array<ComponentRef<PlayerComponent>>();
  }

  private setup(num_of_players: number, radius: number) {
    let mainHeight: number = this.host.nativeElement.offsetHeight;
    let mainWidth: number = this.host.nativeElement.offsetWidth;
    for (var i = 0; i < num_of_players; i++) {
      let initX: number = Math.round(radius * (Math.cos(this.placement_angles[i]))),
        initY: number = Math.round(radius * (Math.sin(this.placement_angles[i])));
      let topp: string = (((mainHeight / 2) - initX - 100) / mainHeight * 100).toPrecision(4) + '%',
        leftp: string = (((mainWidth / 2) * .7 + initY) / mainWidth * 70).toPrecision(4) + '%',
        rotatestr: string = "rotate(" + (i * (360 / num_of_players)) + "deg)";
      let data = { top: topp, left: leftp, rotation: rotatestr, id: this.room_service.players[i] };
      const componentFactory = this.resolver.resolveComponentFactory(PlayerComponent);
      let playerRef = this.container.createComponent(componentFactory);
      const subChoice: Subscription = playerRef.instance.choice.subscribe(event => { this.cardClick(event); });
      const subKeep: Subscription = playerRef.instance.keep.subscribe(event => { this.keepCard(event); });
      playerRef.onDestroy(() => { subChoice.unsubscribe(); subKeep.unsubscribe(); console.log("Unsubscribing PlayerRef") });
      playerRef.instance.data = data;
      this.playerRefs.push(playerRef);
    }
  };

  private generate(num_of_players: number, radius: number) {
    radius = radius * 0.7;
    let frags: number = 360 / num_of_players;
    for (var i = 0; i < num_of_players; i++) {
      this.placement_angles.push((frags / 180) * i * Math.PI + Math.PI);
    }
    this.setup(num_of_players, radius);
  }

  ngOnInit(): void {
    this.loadMassages();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generate(this.player_count, Math.round(this.host.nativeElement.offsetHeight * 0.5));
    }, 0);
  }

  private async keepCard($event){
    this.canDiscard = false;
    let ix = $event.containerID;
    let playerId = $event.playerID;
    let tmpCardPath = await this.room_service.getCard(playerId, ix);
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    let tmpCardRef = this.container.createComponent(componentFactory);
    tmpCardRef.instance.data = { path: tmpCardPath, top: $event.top, left: $event.left };
    this.fromPackOrDiscard(ix);
    setTimeout(() => {  //TO DO animation
      this.discardComponent.setTop(tmpCardRef.instance.path);
      tmpCardRef.destroy();
      this.cardRef.destroy();
    }, 1000);
    this.room_service.nextTurn();
  }

  private fromPackOrDiscard(index:number){
    switch (this.state) {
      case states.FirstState.DRAW:
        this.room_service.takeFromDeck(index);
        break;
      case states.FirstState.DUMPSTER_DIVE:
        this.room_service.takeFromDiscard(index);
        break;
      default:
        throw "fromPackOrDiscard state is invalid - " + this.state;
    }
  }

  private async cardClick($event) { //{ containerID, playerID, top, left }
    this.canDiscard = false;
    let ix = $event.containerID;
    let playerId = $event.playerID;
    if( this.state == states.ActionCard.SWAP_CARDS ){
      this.removeGlow( playerId );
      this.swapString += playerId+':'+ix;
    }

    let tmpCardPath = await this.room_service.getCard(playerId, ix);
    let tmpCardRef = this.showCard( tmpCardPath, $event.top, $event.left );
    this.specialCard( tmpCardRef );
  }

  private specialCard( tmpCardRef: ComponentRef<RevealedCardComponent> ){
    console.log( "my state is " + String(this.state) );
    switch (this.state) {
      case states.ActionCard.PEEK_SELF:
        this.peekCard( tmpCardRef );
        this.playerGlow( Glow.none );
        break;
      case states.ActionCard.PEEK_OPPONENT:
        this.peekCard( tmpCardRef );
        this.opponentGlow( Glow.none );
        break;
      case states.ActionCard.SWAP_CARDS:
        alert("NOT DONE YET");
        if( this.goAgain ){
          console.log("GO AGAIN")
          this.goAgain = false;
          return;
        }
        this.swapCards();
        this.playerGlow( Glow.none );
        this.opponentGlow( Glow.none );
        break;
      case states.ActionCard.ULTIMATE_POWER:
        this.peekCard( tmpCardRef );
        if( this.goAgain ){
          this.goAgain = false;
          return;
        }
        this.playerGlow( Glow.swap );
        this.opponentGlow( Glow.swap );
        this.state = states.ActionCard.SWAP_CARDS;
        this.goAgain = true;
        return;
      default:
        throw "cardClick() failed due to invalid state value -- " + this.state;
        break;
    }
    this.state = states.ActionCard.NONE;
    this.room_service.nextTurn();
  }

  private swapCards(){
    //talk to server
    this.swapString = "";
  }

  private peekCard( tmpCardRef: ComponentRef<RevealedCardComponent> ){
    tmpCardRef.instance.toggleStatus();
    setTimeout(() => {  //TO DO animation
      tmpCardRef.destroy();
    }, 1000);
  }

  async drawCard() {
    console.log("drawCard");
    this.state = states.FirstState.DRAW;
    this.roundStart = false;
    let heldCard = await this.room_service.drawCard();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;
    this.cardRef = this.showCard( heldCard, topp, leftp );
    this.cardRef.instance.toggleStatus();
    this.keepOrDiscard();
  }

  dumpsterDive(){
    console.log("dumpster-dive");
    this.state = states.FirstState.DUMPSTER_DIVE;
    this.roundStart = false;
    let heldCard = this.discardComponent.getTop();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;
    this.cardRef = this.showCard( heldCard, topp, leftp );
    this.cardRef.instance.toggleStatus();
    this.playerGlow( Glow.keep );
  }

  private startTurn() {
    this.packGlow(Glow.draw);
  }

  private showCard( path:any, top:number, left:number ): ComponentRef<RevealedCardComponent>{
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    let tmpCardRef = this.container.createComponent(componentFactory);
    tmpCardRef.instance.data = { path: path, top: top, left: left };
    // this.cardRef = this.container.createComponent(componentFactory);
    // this.cardRef.instance.data = { path: path, top: top, left: left };
    return tmpCardRef;
  }

  private keepOrDiscard() {
    this.playerGlow(Glow.keep);
    this.discardGlow(Glow.remove);
  }

  clickedDiscard() {
    let tmpCardPath = this.cardRef.instance.data.path;
    this.canDiscard = false;
    this.playerGlow(Glow.none);
    this.discardComponent.setTop( tmpCardPath );
    this.room_service.discardCard( tmpCardPath );
    this.state = states.getActionState( tmpCardPath );
    this.resolveCard();
    //TO DO animation
    this.cardRef.destroy();
  }

  private resolveCard() {
    switch (this.state) {
      case states.ActionCard.PEEK_SELF:
        this.playerGlow(Glow.peek);
        break;
      case states.ActionCard.PEEK_OPPONENT:
        this.opponentGlow(Glow.peek);
        break;
      case states.ActionCard.SWAP_CARDS:
        this.goAgain = true;
        this.playerGlow(Glow.swap);
        this.opponentGlow(Glow.swap);
        break;
      case states.ActionCard.ULTIMATE_POWER:
        this.goAgain = true;
        this.playerGlow(Glow.peek);
        this.opponentGlow(Glow.peek);
        break;
      default:
        this.room_service.nextTurn();
        break;
    }
  }

  private playerGlow(mode: string) {
    this.playerRefs[0].instance.setGlow(mode);
  }

  private opponentGlow(mode: string) {
    for (let i = 1; i < this.playerRefs.length; i++)
      this.playerRefs[i].instance.setGlow(mode);
  }

  private packGlow(mode: string) {
    this.roundStart = true;
  }

  private discardGlow(mode: string) {
    this.canDiscard = true;
  }

  private removeGlow( player: string ){
    for (let i = 0; i < this.playerRefs.length; i++) {
      if( this.playerRefs[i].instance.id == player )
        this.playerRefs[i].instance.setGlow( Glow.none );
    }
  }

  private async loadMassages() {
    this.room_service.room.onMessage("my-turn", (message) => {
      this.startTurn();
    });
  }

  private trimPath(path: any): string {
    let _pre = /-/gi;
    let _post = /.png/gi;
    let tmp = String(path);
    tmp = tmp.slice(-6);
    tmp = tmp.replace(_pre, "");
    tmp = tmp.replace(_post, "");
    return tmp;
  }

}
