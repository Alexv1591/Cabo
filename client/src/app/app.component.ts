import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  template:`
              <router-outlet>
                <alert></alert>
              </router-outlet>
            `,
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Cabo';

  ngOnInit():void { }
  
}