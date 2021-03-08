import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import Phaser from 'phaser';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { background } from 'src/app/modules/background';
import { collision } from 'src/app/modules/collision';
import { monsterControl } from 'src/app/modules/monsters/monsterControl';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { game_interface } from 'src/app/modules/interface';
import { mapItemControl } from 'src/app/modules/mapItems/mapItemControl';
import { upgradeControl } from 'src/app/modules/mapItems/upgradeControl';


declare global {
  interface Window {
    onGameOver: () => void;
    onGameOverParent: any;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Output() gameOver: EventEmitter<void> = new EventEmitter();

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
    window.onGameOverParent = this;
    window.onGameOver = () => {
      window.onGameOverParent.gameOver.emit();
    }

    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy()");
    if (this.phaserGame != undefined) {
      this.phaserGame.destroy(true);
    }
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
  interface!: game_interface;
  score: number = 0;
  bgm!: Phaser.Sound.BaseSound;
  currRound: number = 0;
  mapItemControl!: mapItemControl;
  upgradeControl!: upgradeControl


  constructor() {
    super({ key: 'main' });
  }

  preload() {
    //key input
    this.input.keyboard.enabled = true;

    //load assets
    this.background = new background(this, this.collision);
    this.interface = new game_interface(this);
    this.player = new character_swordsman(this, this.collision, this.interface);
    this.mapItemControl = new mapItemControl(this, this.collision);
    this.monsterControl = new monsterControl(this, this.collision, this.background.getBricksArray(), this.mapItemControl, this.background);
    this.collision.addMonsterControl(this.monsterControl);
    this.player.addMonsterControl(this.monsterControl);
    this.upgradeControl = new upgradeControl(this, this.collision);
    this.load.audio("bgm", "./assets/audio/bip-bop.ogg");
    this.load.spritesheet("bone", "./assets/monsters/monster_skeleton/monster_skeleton_bone.png", { frameWidth: 52, frameHeight: 52 });

  }

  create() {
    this.add.sprite(400, 300, "sky");
    this.player.create();
    this.background.createGrid();
    this.interface.create();
    this.sound.add("bgm");
    this.sound.play("bgm", { loop: true });
  }

  update() {
    //sprite update
    this.player.update(this.monsterControl.getHealth());
    this.monsterControl.update(this.player, this.upgradeControl.getUpdateEnd());


    //interface update
    this.score += this.monsterControl.getScore();
    this.interface.changeScore(this.score);
    this.currRound = this.monsterControl.getRound();
    this.interface.changeRound(this.currRound);
    this.interface.update();

    //game update
    this.mapItemControl.update(this.currRound);
    this.upgradeControl.update(this.currRound, this.monsterControl.getRoundEnd());
    this.collision.update();

    //gameover
    if (this.player.checkDeath()) {
      if (window.onGameOver) {
        window.onGameOver();
      }
    }
  }
}
