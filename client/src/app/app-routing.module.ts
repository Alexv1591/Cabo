import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: 'how-to-play', component: HowToPlayComponent },
  { path: '**', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [ MenuComponent, HowToPlayComponent ]