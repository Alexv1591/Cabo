import { AfterContentInit, AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild( 'container', {read: ViewContainerRef} ) container: ViewContainerRef;
  private player_count: number;
  private placement_angles: number[];

  constructor(private resolver: ComponentFactoryResolver, private host:ElementRef) {
    this.placement_angles = new Array<number>();
    this.player_count = 5;
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
      data = [topp,leftp,rotation];
      const componentFactory = this.resolver.resolveComponentFactory(PlayerComponent);
      let playerRef = this.container.createComponent(componentFactory);
      playerRef.instance.data = data;
    }
  };

  public generate(num_of_players: number, radius: number) {
    radius = radius*0.7;
    let frags: number = 360 / num_of_players;
    for (var i = 0; i < num_of_players; i++) {
      this.placement_angles.push((frags / 180) * i * Math.PI + Math.PI );
    }
    this.setup(num_of_players, radius);
  }

  ngOnInit(): void { }

  ngAfterContentInit(): void {  }

  ngAfterViewInit():void {
    setTimeout( () => {
      this.generate(this.player_count, Math.round(this.host.nativeElement.offsetHeight * 0.5));
    }, 0);
  }

}
