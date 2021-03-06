import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NewGameComponent } from './new-game/new-game.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('slideStatus', [
      state('in', style({ 
        height: '200px',
        width: '120px'
       })),
      state('out', style({ 
        height: '200px',
        width: '120px'        
       })),
      transition('in => out', animate('150ms')),
      transition('out => in', animate('15ms'))
    ])
  ]
})
export class MenuComponent implements OnInit, AfterViewInit {
  
  status: 'in' | 'out' = 'out';

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  mainMenuComponent: ComponentRef<MainMenuComponent>;

  constructor(private resolver: ComponentFactoryResolver, private router: Router) { }

  ngOnInit(): void { 
    setTimeout( () => {
      this.status = 'in';
    }, 50);
   }

  ngAfterViewInit(): void { this.loadMainMenuComponent(); }

  playersChoice(choice: string): void {
    this.status = 'out';
    this.container.clear();
    setTimeout( () => {
      this.status = 'in';
      switch (choice) {
        case 'new-game':
          this.loadNewGameComponent();
          break;
        case 'join-game':
          this.router.navigate( ['/game-room'],);
          break;
        case 'how-to-play':
          this.loadHowToPlayComponent();
          break;
        default:
          this.loadMainMenuComponent();
          break;
      }
    }, 200);
  }

  loadMainMenuComponent(): void {
    const componentFactory = this.resolver.resolveComponentFactory(MainMenuComponent);
    this.mainMenuComponent = this.container.createComponent(componentFactory);
    const sub: Subscription = this.mainMenuComponent.instance.choice.subscribe(event => {
      console.log(event);
      this.playersChoice(event);
    });
    this.mainMenuComponent.onDestroy(() => { sub.unsubscribe(); console.log("Unsubscribing") });

  }

  loadNewGameComponent(): void {
    const componentFactory = this.resolver.resolveComponentFactory(NewGameComponent);
    let newRef = this.container.createComponent(componentFactory);
    const sub: Subscription = newRef.instance.choice.subscribe(event => {
      console.log(event);
      this.playersChoice(event);
    });
    this.mainMenuComponent.onDestroy(() => { sub.unsubscribe(); console.log("Unsubscribing") });
  }

  loadHowToPlayComponent(): void {
    const componentFactory = this.resolver.resolveComponentFactory(HowToPlayComponent);
    let h2pref = this.container.createComponent(componentFactory);
    const sub: Subscription = h2pref.instance.choice.subscribe(event => {
      console.log(event);
      this.playersChoice(event);
    });
    this.mainMenuComponent.onDestroy(() => { sub.unsubscribe(); console.log("Unsubscribing") });
  }

}
