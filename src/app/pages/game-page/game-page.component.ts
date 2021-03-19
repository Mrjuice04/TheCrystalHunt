import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameComponent } from '../../components/game/game.component';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit {
  @ViewChild('GameComponent') gameComponent!: GameComponent;

  gameover: boolean = false;
  clearfirstboss: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onExitClicked(): void {
    this.router.navigate(['home']);
  }

  onContinueClicked(): void {
    this.clearfirstboss = false;
  }

  onGameOver(): void {
    if (!this.gameover) {
      console.log ('onGameOver()');
      this.gameover = true;
    }
  }

  onFirstBossClear(): void {
    if (!this.clearfirstboss){
      console.log ('onFirstBossClear()');
      this.clearfirstboss = true;
    }
  }
}
