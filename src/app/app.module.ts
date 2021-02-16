import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { GamePageComponent } from './pages/game-page/game-page.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    GamePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
