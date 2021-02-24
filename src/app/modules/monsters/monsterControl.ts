import { core } from '@angular/compiler';
import { fromEventPattern } from 'rxjs';
import { character_swordsman } from 'src/app/modules/characters/character_holyknight/character_holyknight';
import { collision } from 'src/app/modules/collision';
import { monster_zombie } from 'src/app/modules/monsters/monster_zombie/monster_zombie';
import { monster_skeleton } from 'src/app/modules/monsters/monster_skeleton/monster_skeleton';
import { monster_crystal } from 'src/app/modules/monsters/monster_crystal/monster_crystal';
import { monsterType, isCrystal } from 'src/app/modules/monsters/monster_type';
import { utils } from 'src/app/modules/utils';
import { monster_data, monsterParam } from './monster_spawn';


type players = character_swordsman;

export class monsterControl {
    gameScene: Phaser.Scene;
    collision: collision;
    monsterArray: Array<monsterType> = [];
    anims1Created: boolean = false;
    gridArray: integer[][];
    monsterLimit: number = 10;
    scoreGained: number = 0;
    roundPlaying: boolean = false;
    lastRoundTick!: number;
    scorePerRound: number = 1000;
    currRound: number = 0;
    monsterData: monster_data = new monster_data();
    monsterParam!: Array<monsterParam>;


    constructor(aScene: Phaser.Scene, aCollision: collision, aGridArray: integer[][]) {
        this.gameScene = aScene;
        this.collision = aCollision;
        this.gridArray = aGridArray;
        monster_zombie.loadSprite(this.gameScene);
        monster_crystal.loadSprite(this.gameScene);

        // let monster: Array<monsterParam> = this.monsterData.getArray('round1');
        // console.log ('monster: ' + JSON.stringify(monster));
        // monster[0].count --;

        // let monster2: Array<monsterParam> = this.monsterData.getArray('round1');
        // console.log ('monster2: ' + JSON.stringify(monster2));

    }

    private monsterSpawn(pos_x: number, pos_y: number) {
        let newmonster: monsterParam = { name: '', appearRate: 0, count: 0 };
        for (let i = 0; i < this.monsterParam.length; i++) {
            let spawnRoll = Math.random();
            if (this.monsterParam[i].appearRate >= spawnRoll) {
                newmonster = this.monsterParam[i];
                break;
            }
        }

        if (newmonster.count <= 0) {
            if (this.monsterParam[this.monsterParam.length - 1].count > 0) {
                newmonster = this.monsterParam[this.monsterParam.length - 1];
            } else {
                return;
            }
        }
        newmonster.count--;

        switch (newmonster.name) {
            case "zombie": {
                this.addMonsterZombie(pos_x, pos_y);
                break;
            }
            case "skeleton": {
                this.addMonsterSkeleton(pos_x, pos_y);
                break;
            }
            default: {
                break;
            }
        }
    }

    private addMonsterSkeleton(pos_x: number, pos_y: number) {
        let monster = new monster_skeleton(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterZombie(pos_x: number, pos_y: number) {
        let monster = new monster_zombie(this.gameScene, this.collision, this.gridArray);
        monster.createAnims(this.gameScene);
        monster.create(this.gameScene, pos_x, pos_y);
        this.monsterArray.push(monster);
    }

    private addMonsterCrystal(aPosX: number, aPosY: number) {
        let new_crystal = new monster_crystal(this.gameScene, this.collision);
        new_crystal.create(aPosX, aPosY);
        this.monsterArray.push(new_crystal);
    }

    public update(aPlayerClass: character_swordsman) {
        if (this.roundPlaying) {
            for (let i = 0; i < this.monsterArray.length; i++) {
                let curr_monster = this.monsterArray[i];

                curr_monster.update();
                let aPlayerPosition = aPlayerClass.sprite.getCenter();
                curr_monster.getPostision(aPlayerPosition);
                //monster spawn
                if (this.monsterArray.length < this.monsterLimit && isCrystal(curr_monster)) {
                    if (curr_monster.canSpawn) {
                        let pos = curr_monster.sprite.getCenter();
                        this.monsterSpawn(pos.x, pos.y);
                        curr_monster.canSpawn = false;
                    }
                    if (curr_monster.canHeal) {
                        for (let i = 0; i < this.monsterArray.length; i++) { 
                            let curr_healing_monster = this.monsterArray[i];
                            if (!isCrystal(curr_healing_monster)){
                                curr_healing_monster.isHealed(30);
                            }
                        }
                        curr_monster.canHeal = false;
                    }
                }
                //life check
                if (curr_monster.healthPoint <= 0) {
                    curr_monster.destroy();
                    this.monsterArray.splice(this.monsterArray.indexOf(curr_monster), 1);
                    if (isCrystal(curr_monster)) {
                        this.scoreGained += 500;
                    }
                    this.scoreGained += 100;
                }
            }
            if (this.monsterArray.length <= 0) {
                this.endRound();
            }
        } else {
            if (this.lastRoundTick == undefined || utils.tickElapsed(this.lastRoundTick) >= 5000) {
                this.startRound();
            }
        }

    }

    private startRound() {
        this.roundPlaying = true;
        let pos_y = 50 + (Math.floor(Phaser.Math.FloatBetween(0, 6)) * 75);
        this.addMonsterCrystal(14.5, pos_y);
        pos_y = 50 + (Math.floor(Phaser.Math.FloatBetween(0, 6)) * 75);
        this.addMonsterCrystal(785.5, pos_y);
        this.currRound++;
        this.monsterParam = this.monsterData.getArray('round' + this.currRound);
    }
    

    private endRound() {
        this.roundPlaying = false;
        this.lastRoundTick = utils.getTick();
        this.scoreGained += this.scorePerRound;
        this.scorePerRound += 250;
        this.monsterLimit += 2;
    }


    public getScore() {
        let score = this.scoreGained;
        this.scoreGained = 0;
        return score;
    }

    public getRound() {
        return this.currRound;
    }
}