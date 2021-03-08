import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { InstructionPageComponent } from './pages/instruction-page/instruction-page.component';
import { CreditPageComponent } from './pages/credit-page/credit-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GamePageComponent },
  { path: 'instruction', component: InstructionPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'credit', component: CreditPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
