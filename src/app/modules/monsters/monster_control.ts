import { core } from '@angular/compiler';
import { fromEventPattern } from 'rxjs';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { collision } from 'src/app/modules/collision';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';
import { monsterType, isCrystal } from 'src/app/modules/monsters/monster_type';


type players = character_swordsman;

export class monsterControl {
    gameScene: Phaser.Scene;
    collision: collision;
    monsterArray: Array<monsterType> = [];
    anims1Created: boolean = false;
    gridArray: integer[][];
    nextMonsterAmount: number = 1;


    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gridArray = aGridArray;
        monster_zombie.loadSprite(this.gameScene);
    }

    private addMonster_Zombie(pos_x: number, pos_y: number) {
        let monster = new monster_zombie(this.gameScene, this.collision, this.gridArray);
        if (this.anims1Created == false) {
            monster.createAnims(this.gameScene);
            this.anims1Created = true;
        }
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonster_Crystal(aPosX: number, aPosY: number) {
        let new_crystal = new monster_crystal(this.gameScene, this.collision);
        new_crystal.create(aPosX, aPosY);
        this.monsterArray.push(new_crystal);
    }

    public update(aPlayerClass: character_swordsman) {
        for (let i = 0; i < this.monsterArray.length; i++) {
            let curr_monster = this.monsterArray[i];

            curr_monster.update();
            let aPlayerPosition = aPlayerClass.sprite.getCenter();
            curr_monster.getPostision(aPlayerPosition);
            //if crystal
            if (isCrystal(curr_monster)) {
                if (curr_monster.canSpawn) {
                    let pos = curr_monster.sprite.getCenter();
                    this.addMonster_Zombie(pos.x, pos.y);
                    curr_monster.canSpawn = false;
                }
            }
            //life check
            if (curr_monster.healthPoint <= 0) {
                curr_monster.sprite.destroy();
                this.monsterArray.splice(this.monsterArray.indexOf(curr_monster), 1);
            }
        }

        if (this.monsterArray.length <= 0) {
            this.addMonster_Crystal(12.5, 62.5);
            this.addMonster_Crystal(787.5, 62.5);
        }



    }
}