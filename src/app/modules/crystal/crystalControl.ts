import { core } from '@angular/compiler';
import { fromEventPattern } from 'rxjs';
import { character_swordsman } from '../character_sword/character_swordman';
import { collision } from 'src/app/modules/collision';
import { crystal } from 'src/app/modules/monsters/crystal';


export class monsterControl {
    gameScene: Phaser.Scene
    collision: collision;

    constructor(aScene: Phaser.Scene, aCollision: collision) {
        this.gameScene = aScene;
        this.collision = aCollision;
    }

    public addCrystal() {
        // let crystal1 = new crystal();
    }

    public update() {

    }

}