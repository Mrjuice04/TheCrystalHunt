import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { InstructionPageComponent } from './pages/instruction-page/instruction-page.component';
import { CreditPageComponent } from './pages/credit-page/credit-page.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    GamePageComponent,
    AboutPageComponent,
    InstructionPageComponent,
    CreditPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
