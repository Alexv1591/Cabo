import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements  AfterViewInit {

  @Input('data') data: string[];

  @ViewChild( 'container', {static: true} ) container: ElementRef;
  @ViewChild( '_1', {static: true} ) _1: ElementRef;
  @ViewChild( '_2', {static: true} ) _2: ElementRef;
  @ViewChild( '_3', {static: true} ) _3: ElementRef;
  @ViewChild( '_4', {static: true} ) _4: ElementRef;
  @ViewChild( '_5', {static: true} ) _5: ElementRef;
  @ViewChild( '_6', {static: true} ) _6: ElementRef;
  @ViewChild( '_7', {static: true} ) _7: ElementRef;
  @ViewChild( '_8', {static: true} ) _8: ElementRef;


  constructor( private elRef:ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void{
      this.container.nativeElement.style.top = this.data[0];
      this.container.nativeElement.style.left = this.data[1];
      this.container.nativeElement.style.transform = this.data[2];


    //let placeholder:HTMLElement = this.renderer.createElement('div');
    //this.renderer.appendChild(this.elRef.nativeElement,placeholder);
      // console.log( this.data );
      //this.cdr.detectChanges();
  //     //placeholder.className = 'placeholder number' + i;
  //     console.log(this.data);// + this.data[0] + this.data[1] + this.data[2])
  //     placeholder.style.position = "absolute";
  //     placeholder.style.top = this.data[0]; //100 should be the dig height/2
  //     placeholder.style.left = this.data[1];
  //     placeholder.style.transform = this.data[2];
      // placeholder.style.position = "absolute";
      // placeholder.style.width = "300px";
      // placeholder.style.height = "200px";
      // placeholder.style.border = "2px solid black";
      // let txt: HTMLElement = this.renderer.createText("YARRR");
      // this.renderer.appendChild( placeholder, txt );
  }

}
