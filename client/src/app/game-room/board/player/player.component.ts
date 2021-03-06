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
  
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  constructor(private resolver: ComponentFactoryResolver, private room_service: RoomService) {
    this.isEmpty = [false, false, false, false, true, true, true, true];
    this.cardRefs = new Array<ComponentRef<CardComponent>>();
  }
  
  containerClick(containerId:string): void {
    if( this.isClickable && !this.isEmpty[ Number(containerId) ] )
      this.choice.next( containerId+this.playerId );
  }

  public get id(){
    return this.playerId;
  }

  ngOnInit(): void { }

  public setGlow(color: string) {
    this.isClickable = color!='none';
    for (let i = 0; i < this.cardRefs.length; i++)
      this.cardRefs[i].instance.setGlow(color);
  }

  public removeGlow() {
    this.isClickable = false;
    for (let i = 0; i < this.cardRefs.length; i++) {
      this.cardRefs[i].instance.setGlow( 'none' );
    }
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

}