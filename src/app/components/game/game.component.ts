import { Component, OnInit } from '@angular/core';

import Phaser from 'phaser';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { monsterControl } from 'src/app/modules/monsters/monster_control';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;


  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [MainScene],
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 }
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  player!: character_swordsman;
  background!: background;
  collision = new collision(this);
  monsterControl!: monsterControl;
  keyW!: Phaser.Input.Keyboard.Key;
  keyA!: Phaser.Input.Keyboard.Key;
  keyS!: Phaser.Input.Keyboard.Key;
  keyD!: Phaser.Input.Keyboard.Key;
  keyQ!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'main' });
  }

  preload() {
    //key input
    this.input.keyboard.enabled = true;
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    //load assets
    this.background = new background(this, this.collision);
    this.player = new character_swordsman(this, this.collision);
    this.monsterControl = new monsterControl(this, this.collision, this.background.getBricksArray());
    this.collision.addMonsterControl(this.monsterControl);
    this.player.addMonsterControl(this.monsterControl);
    this.load.image("sky", "./assets/sky.png");
  }

  create() {
    this.add.sprite(400, 300, "sky");
    // this.background.create(this);
    this.player.createAnims(this);
    this.player.create();
    this.background.createGrid();

  }

  update() {
    //key input
    this.player.update();
    this.monsterControl.update(this.player);
  }


}
