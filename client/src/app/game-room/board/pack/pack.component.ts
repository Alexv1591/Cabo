import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.scss']
})
export class PackComponent implements OnInit {

  constructor() { }

  @Input() isActive: boolean;
  @Output()  public choice:EventEmitter<string> = new EventEmitter();

  buttonClick(buttonClicked:string): void {
    //console.log( buttonClicked );
    if( this.isActive )
      this.choice.emit( buttonClicked );
  }

  ngOnInit(): void {
  }

}
