import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input('data') data: string[];

  @ViewChild( 'container', {static: true} ) container: ElementRef;
  @ViewChild( '_0', {read: ViewContainerRef} ) _0: ViewContainerRef;
  @ViewChild( '_1', {read: ViewContainerRef} ) _1: ViewContainerRef;
  @ViewChild( '_2', {read: ViewContainerRef} ) _2: ViewContainerRef;
  @ViewChild( '_3', {read: ViewContainerRef} ) _3: ViewContainerRef;
  @ViewChild( '_4', {read: ViewContainerRef} ) _4: ViewContainerRef;
  @ViewChild( '_5', {read: ViewContainerRef} ) _5: ViewContainerRef;
  @ViewChild( '_6', {read: ViewContainerRef} ) _6: ViewContainerRef;
  @ViewChild( '_7', {read: ViewContainerRef} ) _7: ViewContainerRef;
  private cardRef: ViewContainerRef[];
  public isEmpty: Array<boolean>;
  playerId: string;

  constructor( private resolver: ComponentFactoryResolver, private room_service: RoomService ) {
    this.isEmpty = [ false, false, false, false, true, true, true, true ];
  }

  ngOnInit(): void{ }

  ngAfterViewInit(): void{
    this.cardRef = [ this._0, this._1, this._2, this._3, this._4, this._5, this._6, this._7 ];
    this.setPosition( this.data[0], this.data[1], this.data[2] );
    setTimeout( () => {
      console.log(this.playerId);
      console.log(this.room_service.players);
      this.createCardholders();
      this.playerId = this.data[3];
    }, 0);
  }

  private setPosition( top:string, left: string, rotation:string ): void{
    this.container.nativeElement.style.top = top;
    this.container.nativeElement.style.left = left;
    this.container.nativeElement.style.transform = rotation;
  }

  private createCardholders(): void{
    for (let i = 0; i < this.cardRef.length; i++) {
      const componentFactory = this.resolver.resolveComponentFactory(CardComponent);
      let cardRef = this.cardRef[i].createComponent(componentFactory);
      cardRef.instance.empty = i>3;
    }
  }

}