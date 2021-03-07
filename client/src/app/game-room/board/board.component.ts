import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomService } from '../services/room.service';
import { DiscardComponent } from './discard/discard.component';
import { PlayerComponent } from './player/player.component';
import { RevealedCardComponent } from './revealed-card/revealed-card.component';

enum Glow {
  draw = 'green',
  replace = 'lightgreen',
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
  @ViewChild('pack', { read: ElementRef }) packRef: ElementRef;

  private player_count: number;
  private placement_angles: number[];
  roundStart: boolean = false;
  canDiscard: boolean = false;

  private state: 'peeking-self' | 'peeking-opponent' | 'peeking1' | 'peeking2' | 'swapping' | 'inactive' = 'inactive';

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
      const sub1: Subscription = playerRef.instance.choice.subscribe(event => {
        this.cardClick(event);
      });
      playerRef.onDestroy(() => { sub1.unsubscribe(); console.log("Unsubscribing PlayerRef") });
      const sub2: Subscription = playerRef.instance.keep.subscribe(event => {
        this.keepCard(event);
      });
      playerRef.onDestroy(() => { sub2.unsubscribe(); console.log("Unsubscribing PlayerRef") });
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
    this.playerGlow(Glow.none);
    this.room_service.room.send('swap-with-deck', { index: ix, card: this.cardRef.instance.path });//TO DO rename to take-from-deck
    setTimeout(() => {  //TO DO animation
      this.discardComponent.setTop(tmpCardRef.instance.path);
      tmpCardRef.destroy();
      this.cardRef.destroy();
    }, 1000);
    this.room_service.nextTurn();
  }

  private async cardClick($event) { //{ containerID, playerID, top, left }
    this.canDiscard = false;
    let ix = $event.containerID;
    let playerId = $event.playerID;
    let tmpCardPath = await this.room_service.getCard(playerId, ix);
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    let tmpCardRef = this.container.createComponent(componentFactory);
    tmpCardRef.instance.data = { path: tmpCardPath, top: $event.top, left: $event.left };
    this.specialCard( tmpCardRef );
  }

  private specialCard( tmpCardRef: ComponentRef<RevealedCardComponent> ){
    switch (this.state) {
      case 'peeking-self':
        setTimeout(() => {  //TO DO animation
          tmpCardRef.destroy();
        }, 1000);
        this.playerGlow( Glow.none );
        this.room_service.nextTurn();
        break;
      case 'peeking-opponent':
        setTimeout(() => {  //TO DO animation
          tmpCardRef.destroy();
        }, 1000);
        this.opponentGlow( Glow.none );
        this.room_service.nextTurn();
        break;
      case 'peeking1':
      case 'peeking2':
        setTimeout(() => {  //TO DO animation
          tmpCardRef.destroy();
        }, 1000);
        if( this.state = 'peeking2'){
          this.state = 'peeking1';
          return;
        }
        this.playerGlow( Glow.none );
        this.opponentGlow( Glow.none );
        this.room_service.nextTurn();
        break;
      case 'swapping':

        break;

      default:
        throw "cardClick() failed due to invalid state value -- " + this.state;
        break;
    }

    this.state = 'inactive';
  }

  async drawCard() {
    console.log("drawCard");
    this.roundStart = false;

    let heldCard = await this.room_service.drawCard();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;

    this.showCard( heldCard, topp, leftp );
    this.keepOrDiscard();
  }

  dumpsterDive(){
    console.log("dumpster-dive");
    this.roundStart = false;
    let heldCard = this.discardComponent.getTop();
    let topp = this.pack_discardRef.nativeElement.offsetTop;
    let leftp = this.pack_discardRef.nativeElement.offsetLeft;
    this.showCard( heldCard, topp, leftp );
    this.playerGlow( Glow.replace );
  }

  private startTurn() {
    this.packGlow(Glow.draw);
  }

  private async showCard( path:any, top:number, left:number ){
    const componentFactory = this.resolver.resolveComponentFactory(RevealedCardComponent);
    this.cardRef = this.container.createComponent(componentFactory);
    this.cardRef.instance.data = { path: path, top: top, left: left };
  }

  private keepOrDiscard() {
    this.playerGlow(Glow.replace);
    this.discardGlow(Glow.remove);
  }

  clickedDiscard() {
    this.canDiscard = false;
    this.playerGlow(Glow.none);
    this.discardComponent.setTop(this.cardRef.instance.data.path);
    this.room_service.discardCard(this.cardRef.instance.data.path);
    this.resolveCard(this.trimPath(this.cardRef.instance.data.path));
    //TO DO animation
    this.cardRef.destroy();
  }

  private resolveCard(card: string) {
    console.log(card);
    switch (card) {
      case '7':
      case '8':
        this.state = 'peeking-self';
        this.playerGlow(Glow.peek);
        break;
      case '9':
      case '10':
        this.state = 'peeking-opponent';
        this.opponentGlow(Glow.peek);
        break;
      case '11':
        this.state = 'swapping';
        this.playerGlow(Glow.swap);
        this.opponentGlow(Glow.swap);
        break;
      case '12':
        this.state = 'peeking2';
        this.playerGlow(Glow.peek);
        this.opponentGlow(Glow.peek);
        // this.state = 'swapping';
        // this.playerGlow(Glow.swap);
        // this.opponentGlow(Glow.swap);
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
