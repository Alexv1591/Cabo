import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, AfterViewInit {


  @ViewChild( 'container', {static: true} ) container: ElementRef;
  private placement_angles: number[];

  constructor(private renderer: Renderer2) {
    this.placement_angles = new Array<number>();
  }


  private setup(num_of_players: number, radius: number) {
    //let main:string = document.getElementById(id);
    let mainHeight: number = this.container.nativeElement.offsetHeight;
    let mainWidth: number = this.container.nativeElement.offsetWidth;
    console.log("hei = " + mainHeight );
    console.log("wid = " + mainWidth );
    let circleArray: HTMLElement[] = [];
    for (var i = 0; i < num_of_players; i++) {
      let circle:HTMLElement= this.renderer.createElement('div');
      this.renderer.appendChild(this.container.nativeElement,circle);
      circle.setAttribute("posX",Math.round(radius * (Math.cos(this.placement_angles[i]))) + 'px');
      circle.setAttribute("posY",Math.round(radius * (Math.sin(this.placement_angles[i]))) + 'px');
      circle.className = 'circle number' + i;
      circleArray.push(circle);
      circleArray[i].style.position = "absolute";
      circleArray[i].style.top = ((mainHeight / 2) - parseInt(circleArray[i].getAttribute("posX").slice(0, -2)) - 100 ) + 'px'; //100 should be the dig height/2
      circleArray[i].style.left = ((mainWidth / 2) + parseInt(circleArray[i].getAttribute("posY").slice(0, -2))) + 'px';
      circleArray[i].style.transform = "rotate(" + ( i * (360 / num_of_players)) + "deg)";
      circleArray[i].style
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




  ngOnInit(): void {  }


  ngAfterViewInit(): void {
    console.log(this.container.nativeElement.offsetHeight);
    this.generate(5, Math.round(this.container.nativeElement.offsetHeight * 0.5));

  }

}
