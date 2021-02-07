import { core } from '@angular/compiler';
import { fromEventPattern } from 'rxjs';
import { character_swordsman } from '../character_sword/character_swordman';
import { collision } from 'src/app/modules/collision';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { crystal } from 'src/app/modules/monsters/crystal';


interface mapGrid {
    collider: Phaser.Physics.Arcade.Collider;
    spriteClass: monster_zombie | character_swordsman;
    attackClass: any;
}


export class monsterControl {
    monster1!: monster_zombie;
    gameScene: Phaser.Scene;
    collision: collision;
    monsterArray: Array<monster_zombie> = [];
    crystalArray: Array<crystal> = [];
    anims1Created: boolean = false;
    gridArray: integer[][];
    nextMonsterAmount: number = 1;


    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gridArray = aGridArray;
        monster_zombie.loadSprite(this.gameScene);
    }

    addMonster() {
        let monster = new monster_zombie(this.gameScene, this.collision, this.gridArray);
        if (this.anims1Created == false) {
            monster.createAnims(this.gameScene);
            this.anims1Created = true;
        }
        monster.create(this.gameScene);
        this.monsterArray.push(monster);
    }

    update(aPlayerClass: character_swordsman) {
        if (this.monsterArray.length == 0) {
            for (let i = 0; i < this.nextMonsterAmount; i++) {
                this.addMonster();
            }
            let new_crystal = new crystal(this.gameScene, this.collision);
            new_crystal.create(12.5 ,62.5);
            this.crystalArray.push(new_crystal);
            this.nextMonsterAmount ++;
        }
        
        if (this.monsterArray.length <= 0 && this.crystalArray.length <= 0) {
            for (let i = 0; i < this.nextMonsterAmount; i++) {
                this.addMonster();
            }
            let new_crystal = new crystal(this.gameScene, this.collision);
            new_crystal.create(12.5 ,62.5);
            this.crystalArray.push(new_crystal);
            this.nextMonsterAmount ++;
        }
        let aPlayerPosition = aPlayerClass.sprite.getCenter();

        for (let i = 0; i < this.monsterArray.length; i++) {
            this.monsterArray[i].getPostision(aPlayerPosition);
            this.monsterArray[i].update();
            //life check
            if (this.monsterArray[i].healthPoint <= 0) {
                this.monsterArray[i].sprite.destroy();
                this.monsterArray.splice(this.monsterArray.indexOf(this.monsterArray[i], 1));
            }
        }

    }



}