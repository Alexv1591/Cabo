import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { MenuComponent } from './menu/menu.component';
import { GameRoomModule } from './game-room/game-room.module'
import { GameRoomComponent } from './game-room/game-room.component';

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'game-room', component: GameRoomComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
  { path: '**', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [ MenuComponent, HowToPlayComponent ]