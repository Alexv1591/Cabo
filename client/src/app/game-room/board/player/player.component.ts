import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input('data') data: any;
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('_0', { read: ViewContainerRef }) _0: ViewContainerRef;
  @ViewChild('_1', { read: ViewContainerRef }) _1: ViewContainerRef;
  @ViewChild('_2', { read: ViewContainerRef }) _2: ViewContainerRef;
  @ViewChild('_3', { read: ViewContainerRef }) _3: ViewContainerRef;
  @ViewChild('_4', { read: ViewContainerRef }) _4: ViewContainerRef;
  @ViewChild('_5', { read: ViewContainerRef }) _5: ViewContainerRef;
  @ViewChild('_6', { read: ViewContainerRef }) _6: ViewContainerRef;
  @ViewChild('_7', { read: ViewContainerRef }) _7: ViewContainerRef;
  private containderRef: ViewContainerRef[];
  private cardRefs: ComponentRef<CardComponent>[];
  public isEmpty: Array<boolean>;
  private playerId: string;
  private isClickable: boolean = false;
  private canKeep: boolean = false;
  points: number = 100;

  @Output() public choice: EventEmitter<any> = new EventEmitter();
  @Output() public keep: EventEmitter<any> = new EventEmitter();

  constructor(private resolver: ComponentFactoryResolver, private room_service: RoomService) {
    this.isEmpty = [false, false, false, false, true, true, true, true];
    this.cardRefs = new Array<ComponentRef<CardComponent>>();
  }

  containerClick($event, containerId: string): void {
    let ix = Number(containerId);
    let topp = $event.clientY;
    let leftp = $event.clientX;
    if (this.canKeep) {
      this.canKeep = false;
      this.keep.next({ containerID: ix, playerID: this.playerId, top: topp, left: leftp });
      return;
    }
    if (this.isClickable && !this.isEmpty[ix])
      this.choice.next({ containerID: ix, playerID: this.playerId, top: topp, left: leftp });
  }

  public get id() { return this.playerId; }

  public setPoints( pts: number ){ this.points = pts; }

  public setGlow(color: string) {
    this.isClickable = color != 'none';
    if (color == 'lightgreen') { //TO DO create lightgreen
      this.canKeep = true;
      color = 'green';
    }
    else
      this.canKeep = false;
    for (let i = 0; i < this.cardRefs.length; i++)
      this.cardRefs[i].instance.setGlow(color);
  }

  ngAfterViewInit(): void {
    this.containderRef = [this._0, this._1, this._2, this._3, this._4, this._5, this._6, this._7];
    if (this.data.top == "undefined" || this.data.left == "undefined" || this.data.rotation == "undefined")
      throw "Player data error";
    this.setPosition(this.data.top, this.data.left, this.data.rotation); this.data.top == "undefined"
    setTimeout(() => {
      this.createCardholders();
      this.playerId = this.data.id;
    }, 0);
    this.firstRevealHide();
  }

  private firstRevealShow() {
    setTimeout(() => {
      this.cardRefs[0].instance.toggleHide(false);
      this.cardRefs[1].instance.toggleHide(false);
    }, 50);
  }

  private firstRevealHide() {
    setTimeout(() => {
      this.cardRefs[0].instance.toggleHide(true);
      this.cardRefs[1].instance.toggleHide(true);
    }, 50);
  }

  public async gameOver() {
    for (let i = 0; i < this.cardRefs.length; i++) {
      if (!this.isEmpty[i]) {
        setTimeout(async () => {
          let path = await this.room_service.getCard(i,this.playerId);
          this.cardRefs[i].instance.GameOverChangePic(path);
        }, i * 200);
      }
    }

  }

  private winner() {
    for (let i = 0; i < this.cardRefs.length; i++)
      if (!this.isEmpty[i])
        this.cardRefs[i].instance.setGlow("green");
  }

  private setPosition(top: string, left: string, rotation: string): void {
    this.container.nativeElement.style.top = top;
    this.container.nativeElement.style.left = left;
    this.container.nativeElement.style.transform = rotation;
  }

  private createCardholders(): void {
    for (let i = 0; i < this.containderRef.length; i++) {
      const componentFactory = this.resolver.resolveComponentFactory(CardComponent);
      let cardRef = this.containderRef[i].createComponent(componentFactory);
      cardRef.instance.empty = i > 3;
      this.cardRefs.push(cardRef);
    }
  }

  ngOnInit(): void {
    this.loadMassages();
  }

  private async loadMassages() {
    this.room_service.room.onMessage("everybody-ready", (message) => {
      this.firstRevealShow();
    });
    this.room_service.room.onMessage("card-clicked", (message) => {
      if (this.playerId == message.player)
        this.cardRefs[message.index].instance.toggleFloat();
    });
    this.room_service.room.onMessage("winner", (message) => {
      if (this.playerId == message)
        this.winner();
    });
    this.room_service.room.onMessage("player-take-from-deck", (message) => {
      if (this.playerId == message.player)
        this.cardRefs[message.index].instance.toggleFly();
    });
    this.room_service.room.onMessage("swap-two-cards", (message) => {
      if (this.playerId == message.players[0])
        this.cardRefs[message.cards[0]].instance.toggleFly();
      else if(this.playerId == message.players[1])
        this.cardRefs[message.cards[1]].instance.toggleFly();
    });
  }
}