import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NewGameComponent } from './new-game/new-game.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  mainMenuComponent: ComponentRef<MainMenuComponent>;

  constructor(private resolver: ComponentFactoryResolver, private router: Router) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { this.loadMainMenuComponent(); }

  playersChoice(choice: string): void {
    this.container.clear();
    switch (choice) {
      case 'new-game':
        this.loadNewGameComponent();
        break;
      case 'join-game':
        this.router.navigate( ['/game-room'], {state: {data: { create:false }}});
        break;
      case 'how-to-play':
        this.loadHowToPlayComponent();
        break;
      default:
        this.loadMainMenuComponent();
        break;
    }
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
