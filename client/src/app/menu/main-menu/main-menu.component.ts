import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor() { }

  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  buttonClick(buttonClicked:string): void {
    this.choice.next( buttonClicked );
  }

  ngOnInit(): void {
  }

}
