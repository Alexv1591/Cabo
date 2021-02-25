import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { MenuComponent } from './menu.component';
import { NewGameComponent } from './new-game/new-game.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
  { path: 'new-game', component: NewGameComponent },
  { path: '**', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }

export const menuRoutingComponents = [ NewGameComponent ];